namespace TechCommunity.Application.Features.Posts.DTOs;

/// <summary>
/// DTO for detailed post view
/// </summary>
public record PostDetailDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? CoverImageUrl { get; init; }
    public bool IsFeatured { get; init; }
    public bool IsPublished { get; init; }
    public int ViewCount { get; init; }
    public int LikeCount { get; init; }
    public int CommentCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public DateTime? PublishedAt { get; init; }
    public AuthorDto Author { get; init; } = null!;
    public IReadOnlyList<TagDto> Tags { get; init; } = [];
    public bool IsAuthor { get; init; }
    public bool HasLiked { get; init; }
}
