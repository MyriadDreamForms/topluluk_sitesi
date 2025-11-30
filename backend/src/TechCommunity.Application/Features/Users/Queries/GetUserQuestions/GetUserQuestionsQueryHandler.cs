using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Questions.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserQuestions;

public class GetUserQuestionsQueryHandler : IRequestHandler<GetUserQuestionsQuery, PaginatedList<QuestionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUserQuestionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<QuestionDto>> Handle(GetUserQuestionsQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower() && !u.IsBanned, cancellationToken);

        if (user is null)
        {
            throw new NotFoundException("User", request.Username);
        }

        var query = _context.Questions
            .Where(q => q.AuthorId == user.Id && !q.IsDeleted)
            .OrderByDescending(q => q.CreatedAt)
            .Select(q => new QuestionDto
            {
                Id = q.Id,
                Title = q.Title,
                Slug = q.Slug,
                BodyPreview = q.Body.Length > 200 ? q.Body.Substring(0, 200) + "..." : q.Body,
                ViewCount = q.ViewCount,
                AnswerCount = q.AnswerCount,
                HasAcceptedAnswer = q.AcceptedAnswerId.HasValue,
                CreatedAt = q.CreatedAt,
                Author = new QuestionAuthorDto
                {
                    Id = q.Author.Id,
                    Username = q.Author.Username,
                    DisplayName = q.Author.DisplayName ?? q.Author.Username,
                    AvatarUrl = q.Author.AvatarUrl
                },
                Tags = q.QuestionTags.Select(qt => new QuestionTagDto
                {
                    Id = qt.Tag.Id,
                    Name = qt.Tag.Name,
                    Slug = qt.Tag.Slug
                }).ToList()
            });

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedList<QuestionDto>(items, totalCount, request.Page, request.PageSize);
    }
}
