using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Services;
using TechCommunity.Application.Features.Posts.DTOs;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Features.Posts.Commands.UpdatePost;

public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, PostDetailDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ISlugService _slugService;
    private readonly ICacheInvalidationService _cacheInvalidationService;

    public UpdatePostCommandHandler(
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

    public async Task<PostDetailDto> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Kullanıcı oturumu geçersiz.");

        var post = await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Post", request.Id);

        // Check ownership or admin role
        if (post.AuthorId != userId)
        {
            var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
            if (user?.Role != Domain.Enums.UserRole.Admin && user?.Role != Domain.Enums.UserRole.Moderator)
            {
                throw new ForbiddenException("Bu yazıyı düzenleme yetkiniz yok.");
            }
        }

        // Update slug only if title changed
        if (post.Title != request.Title)
        {
            var baseSlug = _slugService.GenerateSlug(request.Title);
            post.Slug = await GenerateUniqueSlugAsync(baseSlug, post.Id, cancellationToken);
        }

        // Update excerpt
        var excerpt = request.Excerpt;
        if (string.IsNullOrEmpty(excerpt))
        {
            excerpt = request.Content.Length > 200 
                ? request.Content.Substring(0, 200) + "..." 
                : request.Content;
        }

        post.Title = request.Title;
        post.Content = request.Content;
        post.Excerpt = excerpt;
        post.CoverImageUrl = request.CoverImageUrl;
        post.UpdatedAt = DateTime.UtcNow;

        // Handle publish status change
        if (request.IsPublished && !post.IsPublished)
        {
            post.IsPublished = true;
            post.PublishedAt = DateTime.UtcNow;
        }
        else if (!request.IsPublished)
        {
            post.IsPublished = false;
        }

        // Update tags
        _context.PostTags.RemoveRange(post.PostTags);
        post.PostTags.Clear();

        var tagEntities = await GetOrCreateTagsAsync(request.Tags, cancellationToken);
        foreach (var tag in tagEntities)
        {
            post.PostTags.Add(new PostTag { PostId = post.Id, TagId = tag.Id });
        }

        await _context.SaveChangesAsync(cancellationToken);

        // Invalidate related caches
        await _cacheInvalidationService.InvalidatePostCachesAsync(post.Slug, cancellationToken);

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
            ViewCount = post.ViewCount,
            LikeCount = post.LikeCount,
            CommentCount = post.Comments.Count,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            PublishedAt = post.PublishedAt,
            Author = new AuthorDto
            {
                Id = post.Author.Id,
                Username = post.Author.Username,
                DisplayName = post.Author.DisplayName,
                AvatarUrl = post.Author.AvatarUrl
            },
            Tags = tagEntities.Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug
            }).ToList(),
            IsAuthor = post.AuthorId == userId,
            HasLiked = false
        };
    }

    private async Task<string> GenerateUniqueSlugAsync(string baseSlug, Guid currentPostId, CancellationToken cancellationToken)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _context.Posts.AnyAsync(p => p.Slug == slug && p.Id != currentPostId, cancellationToken))
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
