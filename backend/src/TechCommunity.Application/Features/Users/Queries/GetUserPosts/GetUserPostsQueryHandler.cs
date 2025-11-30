using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserPosts;

public class GetUserPostsQueryHandler : IRequestHandler<GetUserPostsQuery, PaginatedList<PostDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUserPostsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<PostDto>> Handle(GetUserPostsQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower() && !u.IsBanned, cancellationToken);

        if (user is null)
        {
            throw new NotFoundException("User", request.Username);
        }

        var query = _context.Posts
            .Where(p => p.AuthorId == user.Id && p.IsPublished)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Excerpt = p.Excerpt,
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
                    DisplayName = p.Author.DisplayName ?? p.Author.Username,
                    AvatarUrl = p.Author.AvatarUrl
                },
                Tags = p.PostTags.Select(pt => new TagDto
                {
                    Id = pt.Tag.Id,
                    Name = pt.Tag.Name,
                    Slug = pt.Tag.Slug
                }).ToList()
            });

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedList<PostDto>(items, totalCount, request.Page, request.PageSize);
    }
}
