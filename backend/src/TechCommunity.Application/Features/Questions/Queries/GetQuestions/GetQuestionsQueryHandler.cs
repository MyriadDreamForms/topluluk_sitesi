using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Questions.DTOs;

namespace TechCommunity.Application.Features.Questions.Queries.GetQuestions;

public class GetQuestionsQueryHandler : IRequestHandler<GetQuestionsQuery, PaginatedList<QuestionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetQuestionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<QuestionDto>> Handle(GetQuestionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Questions
            .AsNoTracking()
            .Where(q => !q.IsDeleted)
            .Include(q => q.Author)
            .Include(q => q.QuestionTags)
            .ThenInclude(qt => qt.Tag)
            .AsQueryable();

        // Search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchTerm = request.Search.ToLower();
            query = query.Where(q =>
                q.Title.ToLower().Contains(searchTerm) ||
                q.Body.ToLower().Contains(searchTerm));
        }

        // Tag filter
        if (!string.IsNullOrWhiteSpace(request.Tag))
        {
            query = query.Where(q => q.QuestionTags.Any(qt => qt.Tag.Slug == request.Tag));
        }

        // Author filter
        if (!string.IsNullOrWhiteSpace(request.AuthorUsername))
        {
            query = query.Where(q => q.Author.Username == request.AuthorUsername);
        }

        // Accepted answer filter
        if (request.HasAcceptedAnswer.HasValue)
        {
            if (request.HasAcceptedAnswer.Value)
            {
                query = query.Where(q => q.AcceptedAnswerId != null);
            }
            else
            {
                query = query.Where(q => q.AcceptedAnswerId == null);
            }
        }

        // Sorting
        query = request.SortBy.ToLower() switch
        {
            "popular" => query.OrderByDescending(q => q.ViewCount).ThenByDescending(q => q.AnswerCount),
            "unanswered" => query.Where(q => q.AnswerCount == 0).OrderByDescending(q => q.CreatedAt),
            "oldest" => query.OrderBy(q => q.CreatedAt),
            _ => query.OrderByDescending(q => q.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(q => new QuestionDto
            {
                Id = q.Id,
                Title = q.Title,
                Slug = q.Slug,
                BodyPreview = q.Body.Length > 200 ? q.Body.Substring(0, 200) + "..." : q.Body,
                ViewCount = q.ViewCount,
                AnswerCount = q.AnswerCount,
                HasAcceptedAnswer = q.AcceptedAnswerId != null,
                CreatedAt = q.CreatedAt,
                Author = new QuestionAuthorDto
                {
                    Id = q.Author.Id,
                    Username = q.Author.Username,
                    DisplayName = q.Author.DisplayName,
                    AvatarUrl = q.Author.AvatarUrl
                },
                Tags = q.QuestionTags.Select(qt => new QuestionTagDto
                {
                    Id = qt.Tag.Id,
                    Name = qt.Tag.Name,
                    Slug = qt.Tag.Slug
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return new PaginatedList<QuestionDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
