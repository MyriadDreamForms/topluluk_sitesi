namespace TechCommunity.Application.Features.Feed.DTOs;

public record FeedItemDto
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty; // "post", "question"
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public FeedAuthorDto Author { get; init; } = null!;
    public DateTime CreatedAt { get; init; }
    public int ViewCount { get; init; }
    public int CommentCount { get; init; }
    public int AnswerCount { get; init; }
    public bool HasAcceptedAnswer { get; init; }
    public List<FeedTagDto> Tags { get; init; } = new();
}

public record FeedAuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

public record FeedTagDto
{
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}
