using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Services;
using TechCommunity.Application.Features.Posts.DTOs;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Features.Posts.Commands.CreatePost;

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, PostDetailDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ISlugService _slugService;
    private readonly ICacheInvalidationService _cacheInvalidationService;

    public CreatePostCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ISlugService slugService,
        ICacheInvalidationService cacheInvalidationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _slugService = slugService;
        _cacheInvalidationService = cacheInvalidationService;
    }

    public async Task<PostDetailDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Kullanıcı oturumu geçersiz.");

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new UnauthorizedException("Kullanıcı bulunamadı.");

        // Generate unique slug
        var baseSlug = _slugService.GenerateSlug(request.Title);
        var slug = await GenerateUniqueSlugAsync(baseSlug, cancellationToken);

        // Generate excerpt if not provided
        var excerpt = request.Excerpt;
        if (string.IsNullOrEmpty(excerpt))
        {
            excerpt = request.Content.Length > 200 
                ? request.Content.Substring(0, 200) + "..." 
                : request.Content;
        }

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Slug = slug,
            Content = request.Content,
            Excerpt = excerpt,
            CoverImageUrl = request.CoverImageUrl,
            IsPublished = request.IsPublished,
            PublishedAt = request.IsPublished ? DateTime.UtcNow : null,
            AuthorId = userId,
            CreatedAt = DateTime.UtcNow
        };

        // Handle tags
        var tagEntities = await GetOrCreateTagsAsync(request.Tags, cancellationToken);
        foreach (var tag in tagEntities)
        {
            post.PostTags.Add(new PostTag { PostId = post.Id, TagId = tag.Id });
        }

        _context.Posts.Add(post);
        await _context.SaveChangesAsync(cancellationToken);

        // Invalidate related caches
        await _cacheInvalidationService.InvalidatePostCachesAsync(cancellationToken: cancellationToken);

        return new PostDetailDto
        {
            Id = post.Id,
            Title = post.Title,
            Slug = post.Slug,
            Content = post.Content,
            Excerpt = post.Excerpt,
            CoverImageUrl = post.CoverImageUrl,
            IsFeatured = post.IsFeatured,
            IsPublished = post.IsPublished,
            ViewCount = 0,
            LikeCount = 0,
            CommentCount = 0,
            CreatedAt = post.CreatedAt,
            PublishedAt = post.PublishedAt,
            Author = new AuthorDto
            {
                Id = user.Id,
                Username = user.Username,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl
            },
            Tags = tagEntities.Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug
            }).ToList(),
            IsAuthor = true,
            HasLiked = false
        };
    }

    private async Task<string> GenerateUniqueSlugAsync(string baseSlug, CancellationToken cancellationToken)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _context.Posts.AnyAsync(p => p.Slug == slug, cancellationToken))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }

    private async Task<List<Tag>> GetOrCreateTagsAsync(IReadOnlyList<string> tagNames, CancellationToken cancellationToken)
    {
        var tags = new List<Tag>();

        foreach (var tagName in tagNames.Distinct())
        {
            var normalizedName = tagName.Trim().ToLowerInvariant();
            var tag = await _context.Tags
                .FirstOrDefaultAsync(t => t.Name.ToLower() == normalizedName, cancellationToken);

            if (tag == null)
            {
                tag = new Tag
                {
                    Id = Guid.NewGuid(),
                    Name = tagName.Trim(),
                    Slug = _slugService.GenerateSlug(tagName),
                    CreatedAt = DateTime.UtcNow
                };
                _context.Tags.Add(tag);
            }

            tags.Add(tag);
        }

        return tags;
    }
}
