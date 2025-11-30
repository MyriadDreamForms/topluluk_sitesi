using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Posts.Queries.GetPosts;

public class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, PaginatedList<PostDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPostsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<PostDto>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Posts
            .AsNoTracking()
            .Include(p => p.Author)
            .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
            .Include(p => p.Comments)
            .Where(p => p.IsPublished && !p.IsDeleted);

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(p => 
                p.Title.ToLower().Contains(searchLower) || 
                p.Content.ToLower().Contains(searchLower));
        }

        if (!string.IsNullOrWhiteSpace(request.Tag))
        {
            query = query.Where(p => p.PostTags.Any(pt => pt.Tag.Slug == request.Tag));
        }

        if (!string.IsNullOrWhiteSpace(request.AuthorUsername))
        {
            query = query.Where(p => p.Author.Username == request.AuthorUsername);
        }

        if (request.IsFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == request.IsFeatured.Value);
        }

        // Apply sorting
        query = request.SortBy.ToLower() switch
        {
            "popular" => query.OrderByDescending(p => p.ViewCount),
            "trending" => query.OrderByDescending(p => p.LikeCount).ThenByDescending(p => p.ViewCount),
            "oldest" => query.OrderBy(p => p.PublishedAt),
            _ => query.OrderByDescending(p => p.PublishedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Excerpt = p.Excerpt ?? string.Empty,
                CoverImageUrl = p.CoverImageUrl,
                IsFeatured = p.IsFeatured,
                IsPublished = p.IsPublished,
                ViewCount = p.ViewCount,
                LikeCount = p.LikeCount,
                CommentCount = p.Comments.Count(c => !c.IsDeleted),
                CreatedAt = p.CreatedAt,
                PublishedAt = p.PublishedAt,
                Author = new AuthorDto
                {
                    Id = p.Author.Id,
                    Username = p.Author.Username,
                    DisplayName = p.Author.DisplayName,
                    AvatarUrl = p.Author.AvatarUrl
                },
                Tags = p.PostTags.Select(pt => new TagDto
                {
                    Id = pt.Tag.Id,
                    Name = pt.Tag.Name,
                    Slug = pt.Tag.Slug
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return new PaginatedList<PostDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
