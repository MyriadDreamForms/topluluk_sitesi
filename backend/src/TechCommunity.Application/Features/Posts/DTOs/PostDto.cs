namespace TechCommunity.Application.Features.Posts.DTOs;

/// <summary>
/// DTO for post list items
/// </summary>
public record PostDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Excerpt { get; init; } = string.Empty;
    public string? CoverImageUrl { get; init; }
    public bool IsFeatured { get; init; }
    public bool IsPublished { get; init; }
    public int ViewCount { get; init; }
    public int LikeCount { get; init; }
    public int CommentCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? PublishedAt { get; init; }
    public AuthorDto Author { get; init; } = null!;
    public IReadOnlyList<TagDto> Tags { get; init; } = [];
}

/// <summary>
/// DTO for author summary
/// </summary>
public record AuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

/// <summary>
/// DTO for tag summary
/// </summary>
public record TagDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}
