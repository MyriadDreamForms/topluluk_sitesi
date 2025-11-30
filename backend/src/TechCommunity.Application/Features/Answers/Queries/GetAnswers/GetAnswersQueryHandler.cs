using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Answers.DTOs;

namespace TechCommunity.Application.Features.Answers.Queries.GetAnswers;

public class GetAnswersQueryHandler : IRequestHandler<GetAnswersQuery, PaginatedList<AnswerDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetAnswersQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PaginatedList<AnswerDto>> Handle(GetAnswersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Answers
            .AsNoTracking()
            .Where(a => a.QuestionId == request.QuestionId)
            .Include(a => a.Author)
            .Include(a => a.Comments)
            .AsQueryable();

        // Sorting - accepted answers always first
        query = request.SortBy.ToLower() switch
        {
            "latest" => query.OrderByDescending(a => a.IsAccepted).ThenByDescending(a => a.CreatedAt),
            "accepted" => query.OrderByDescending(a => a.IsAccepted).ThenBy(a => a.CreatedAt),
            _ => query.OrderByDescending(a => a.IsAccepted).ThenBy(a => a.CreatedAt) // oldest
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var currentUserId = _currentUser.UserId;

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => new AnswerDto
            {
                Id = a.Id,
                Body = a.Body,
                BodyHtml = a.BodyHtml,
                QuestionId = a.QuestionId,
                IsAccepted = a.IsAccepted,
                CommentCount = a.Comments.Count,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                IsAuthor = currentUserId.HasValue && a.AuthorId == currentUserId.Value,
                Author = new AnswerAuthorDto
                {
                    Id = a.Author.Id,
                    Username = a.Author.Username,
                    DisplayName = a.Author.DisplayName,
                    AvatarUrl = a.Author.AvatarUrl
                }
            })
            .ToListAsync(cancellationToken);

        return new PaginatedList<AnswerDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
