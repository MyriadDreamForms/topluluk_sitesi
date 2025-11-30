using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Feed.DTOs;

namespace TechCommunity.Application.Features.Feed.Queries.GetFeed;

public class GetFeedQueryHandler : IRequestHandler<GetFeedQuery, PaginatedList<FeedItemDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetFeedQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<PaginatedList<FeedItemDto>> Handle(GetFeedQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"feed:{request.SortBy}:{request.PageNumber}:{request.PageSize}";

        var cached = await _cacheService.GetAsync<PaginatedList<FeedItemDto>>(cacheKey, cancellationToken);
        if (cached != null)
        {
            return cached;
        }

        var items = new List<FeedItemDto>();

        // Get posts
        var posts = await _context.Posts
            .AsNoTracking()
            .Where(p => !p.IsDeleted)
            .Select(p => new FeedItemDto
            {
                Id = p.Id,
                Type = "post",
                Title = p.Title,
                Slug = p.Slug,
                Excerpt = p.Content.Length > 200 ? p.Content.Substring(0, 200) + "..." : p.Content,
                Author = new FeedAuthorDto
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
                Tags = p.PostTags.Select(pt => new FeedTagDto
                {
                    Name = pt.Tag.Name,
                    Slug = pt.Tag.Slug
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        items.AddRange(posts);

        // Get questions
        var questions = await _context.Questions
            .AsNoTracking()
            .Where(q => !q.IsDeleted)
            .Select(q => new FeedItemDto
            {
                Id = q.Id,
                Type = "question",
                Title = q.Title,
                Slug = q.Slug,
                Excerpt = q.Body.Length > 200 ? q.Body.Substring(0, 200) + "..." : q.Body,
                Author = new FeedAuthorDto
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
                Tags = q.QuestionTags.Select(qt => new FeedTagDto
                {
                    Name = qt.Tag.Name,
                    Slug = qt.Tag.Slug
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        items.AddRange(questions);

        // Apply sorting
        items = request.SortBy switch
        {
            "popular" => items.OrderByDescending(i => i.ViewCount).ThenByDescending(i => i.CreatedAt).ToList(),
            "trending" => items
                .Where(i => i.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                .OrderByDescending(i => CalculateTrendingScore(i))
                .ToList(),
            _ => items.OrderByDescending(i => i.CreatedAt).ToList()
        };

        var totalCount = items.Count;
        var pagedItems = items
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var result = new PaginatedList<FeedItemDto>(pagedItems, totalCount, request.PageNumber, request.PageSize);

        // Cache for 2 minutes
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(2), cancellationToken);

        return result;
    }

    private static double CalculateTrendingScore(FeedItemDto item)
    {
        var hoursAge = (DateTime.UtcNow - item.CreatedAt).TotalHours;
        var interactions = item.ViewCount + (item.CommentCount * 5) + (item.AnswerCount * 10);
        
        // Decay factor - newer content ranks higher
        var decayFactor = Math.Pow(0.95, hoursAge / 24);
        
        return interactions * decayFactor;
    }
}
