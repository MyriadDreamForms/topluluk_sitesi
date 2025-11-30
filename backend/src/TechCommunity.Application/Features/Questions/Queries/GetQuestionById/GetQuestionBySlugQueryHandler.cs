using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Questions.DTOs;

namespace TechCommunity.Application.Features.Questions.Queries.GetQuestionById;

public class GetQuestionBySlugQueryHandler : IRequestHandler<GetQuestionBySlugQuery, QuestionDetailDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetQuestionBySlugQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<QuestionDetailDto> Handle(GetQuestionBySlugQuery request, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .AsNoTracking()
            .Include(q => q.Author)
            .Include(q => q.QuestionTags)
            .ThenInclude(qt => qt.Tag)
            .FirstOrDefaultAsync(q => q.Slug == request.Slug && !q.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Soru", request.Slug);

        // Increment view count (use ExecuteUpdate for better performance)
        await _context.Questions
            .Where(q => q.Id == question.Id)
            .ExecuteUpdateAsync(q => q.SetProperty(x => x.ViewCount, x => x.ViewCount + 1), cancellationToken);

        var isAuthor = _currentUser.UserId.HasValue && question.AuthorId == _currentUser.UserId.Value;

        return new QuestionDetailDto
        {
            Id = question.Id,
            Title = question.Title,
            Slug = question.Slug,
            Body = question.Body,
            BodyHtml = question.BodyHtml,
            ViewCount = question.ViewCount + 1,
            AnswerCount = question.AnswerCount,
            AcceptedAnswerId = question.AcceptedAnswerId,
            CreatedAt = question.CreatedAt,
            UpdatedAt = question.UpdatedAt,
            IsAuthor = isAuthor,
            Author = new QuestionAuthorDto
            {
                Id = question.Author.Id,
                Username = question.Author.Username,
                DisplayName = question.Author.DisplayName,
                AvatarUrl = question.Author.AvatarUrl
            },
            Tags = question.QuestionTags.Select(qt => new QuestionTagDto
            {
                Id = qt.Tag.Id,
                Name = qt.Tag.Name,
                Slug = qt.Tag.Slug
            }).ToList()
        };
    }
}
