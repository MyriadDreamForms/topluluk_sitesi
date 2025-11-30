using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Posts.Queries.GetPostById;

public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, PostDetailDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetPostByIdQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PostDetailDto> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        var post = await _context.Posts
            .AsNoTracking()
            .Include(p => p.Author)
            .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Slug == request.Slug && !p.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Post", request.Slug);

        // Check if post is published or user is author/admin
        var userId = _currentUserService.UserId;
        var isAuthor = userId.HasValue && post.AuthorId == userId.Value;

        if (!post.IsPublished && !isAuthor)
        {
            // Check if user is admin/moderator
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(new object[] { userId.Value }, cancellationToken);
                if (user?.Role != Domain.Enums.UserRole.Admin && user?.Role != Domain.Enums.UserRole.Moderator)
                {
                    throw new NotFoundException("Post", request.Slug);
                }
            }
            else
            {
                throw new NotFoundException("Post", request.Slug);
            }
        }

        // Get comment count separately
        var commentCount = await _context.Comments
            .CountAsync(c => c.PostId == post.Id && !c.IsDeleted, cancellationToken);

        // Increment view count (do this in a separate non-blocking operation ideally)
        await IncrementViewCountAsync(post.Id, cancellationToken);

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
            ViewCount = post.ViewCount + 1, // Include the current view
            LikeCount = post.LikeCount,
            CommentCount = commentCount,
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
            Tags = post.PostTags.Select(pt => new TagDto
            {
                Id = pt.Tag.Id,
                Name = pt.Tag.Name,
                Slug = pt.Tag.Slug
            }).ToList(),
            IsAuthor = isAuthor,
            HasLiked = false // TODO: Implement like tracking
        };
    }

    private async Task IncrementViewCountAsync(Guid postId, CancellationToken cancellationToken)
    {
        // Use raw SQL for atomic increment to avoid concurrency issues
        await _context.Posts
            .Where(p => p.Id == postId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(p => p.ViewCount, p => p.ViewCount + 1),
                cancellationToken);
    }
}
