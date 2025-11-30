using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Search.DTOs;

namespace TechCommunity.Application.Features.Search.Queries.Search;

public class SearchQueryHandler : IRequestHandler<SearchQuery, PaginatedList<SearchResultDto>>
{
    private readonly IApplicationDbContext _context;

    public SearchQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<SearchResultDto>> Handle(SearchQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
        {
            return new PaginatedList<SearchResultDto>(new List<SearchResultDto>(), 0, 1, request.PageSize);
        }

        var searchTerms = request.Query.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var results = new List<SearchResultDto>();

        // Search Posts
        if (request.Type == null || request.Type == "posts")
        {
            var postsQuery = _context.Posts
                .AsNoTracking()
                .Where(p => !p.IsDeleted);

            // Apply text search
            foreach (var term in searchTerms)
            {
                postsQuery = postsQuery.Where(p =>
                    p.Title.ToLower().Contains(term) ||
                    p.Content.ToLower().Contains(term));
            }

            // Apply tag filter
            if (!string.IsNullOrWhiteSpace(request.Tag))
            {
                postsQuery = postsQuery.Where(p => p.PostTags.Any(pt => pt.Tag.Slug == request.Tag));
            }

            var posts = await postsQuery
                .OrderByDescending(p => p.CreatedAt)
                .Take(100)
                .Select(p => new SearchResultDto
                {
                    Id = p.Id,
                    Type = "post",
                    Title = p.Title,
                    Slug = p.Slug,
                    Excerpt = p.Content.Length > 200 ? p.Content.Substring(0, 200) + "..." : p.Content,
                    Author = new SearchAuthorDto
                    {
                        Id = p.Author.Id,
                        Username = p.Author.Username,
                        DisplayName = p.Author.DisplayName,
                        AvatarUrl = p.Author.AvatarUrl
                    },
                    CreatedAt = p.CreatedAt,
                    ViewCount = p.ViewCount,
                    CommentCount = p.Comments.Count(c => !c.IsDeleted),
                    AnswerCount = 0,
                    HasAcceptedAnswer = false,
                    Tags = p.PostTags.Select(pt => pt.Tag.Name).ToList(),
                    Relevance = 1.0
                })
                .ToListAsync(cancellationToken);

            results.AddRange(posts);
        }

        // Search Questions
        if (request.Type == null || request.Type == "questions")
        {
            var questionsQuery = _context.Questions
                .AsNoTracking()
                .Where(q => !q.IsDeleted);

            // Apply text search
            foreach (var term in searchTerms)
            {
                questionsQuery = questionsQuery.Where(q =>
                    q.Title.ToLower().Contains(term) ||
                    q.Body.ToLower().Contains(term));
            }

            // Apply tag filter
            if (!string.IsNullOrWhiteSpace(request.Tag))
            {
                questionsQuery = questionsQuery.Where(q => q.QuestionTags.Any(qt => qt.Tag.Slug == request.Tag));
            }

            var questions = await questionsQuery
                .OrderByDescending(q => q.CreatedAt)
                .Take(100)
                .Select(q => new SearchResultDto
                {
                    Id = q.Id,
                    Type = "question",
                    Title = q.Title,
                    Slug = q.Slug,
                    Excerpt = q.Body.Length > 200 ? q.Body.Substring(0, 200) + "..." : q.Body,
                    Author = new SearchAuthorDto
                    {
                        Id = q.Author.Id,
                        Username = q.Author.Username,
                        DisplayName = q.Author.DisplayName,
                        AvatarUrl = q.Author.AvatarUrl
                    },
                    CreatedAt = q.CreatedAt,
                    ViewCount = q.ViewCount,
                    CommentCount = 0,
                    AnswerCount = q.AnswerCount,
                    HasAcceptedAnswer = q.AcceptedAnswerId.HasValue,
                    Tags = q.QuestionTags.Select(qt => qt.Tag.Name).ToList(),
                    Relevance = 1.0
                })
                .ToListAsync(cancellationToken);

            results.AddRange(questions);
        }

        // Search Users
        if (request.Type == null || request.Type == "users")
        {
            var usersQuery = _context.Users
                .AsNoTracking()
                .Where(u => !u.IsBanned);

            // Apply text search
            foreach (var term in searchTerms)
            {
                usersQuery = usersQuery.Where(u =>
                    u.Username.ToLower().Contains(term) ||
                    u.DisplayName.ToLower().Contains(term) ||
                    (u.Bio != null && u.Bio.ToLower().Contains(term)));
            }

            var users = await usersQuery
                .OrderByDescending(u => u.CreatedAt)
                .Take(50)
                .Select(u => new SearchResultDto
                {
                    Id = u.Id,
                    Type = "user",
                    Title = u.DisplayName,
                    Slug = u.Username,
                    Excerpt = u.Bio,
                    AvatarUrl = u.AvatarUrl,
                    Author = null,
                    CreatedAt = u.CreatedAt,
                    ViewCount = 0,
                    CommentCount = 0,
                    AnswerCount = 0,
                    HasAcceptedAnswer = false,
                    Tags = new List<string>(),
                    Relevance = 1.0
                })
                .ToListAsync(cancellationToken);

            results.AddRange(users);
        }

        // Calculate simple relevance based on search terms
        foreach (var result in results)
        {
            double relevance = 0;
            var titleLower = result.Title.ToLower();
            var excerptLower = result.Excerpt?.ToLower() ?? "";

            foreach (var term in searchTerms)
            {
                if (titleLower.Contains(term)) relevance += 2.0;
                if (excerptLower.Contains(term)) relevance += 1.0;
            }

            // Boost by recency
            var daysSinceCreation = (DateTime.UtcNow - result.CreatedAt).TotalDays;
            relevance += Math.Max(0, 1.0 - (daysSinceCreation / 365.0));

            results[results.IndexOf(result)] = result with { Relevance = relevance };
        }

        // Sort by relevance
        results = results.OrderByDescending(r => r.Relevance).ToList();

        var totalCount = results.Count;
        var pagedResults = results
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        return new PaginatedList<SearchResultDto>(pagedResults, totalCount, request.PageNumber, request.PageSize);
    }
}
