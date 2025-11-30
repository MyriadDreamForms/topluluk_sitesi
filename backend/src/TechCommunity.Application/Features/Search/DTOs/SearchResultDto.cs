namespace TechCommunity.Application.Features.Search.DTOs;

public record SearchResultDto
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty; // "post", "question", "user"
    public string Title { get; init; } = string.Empty;
    public string? Slug { get; init; }
    public string? Excerpt { get; init; }
    public string? AvatarUrl { get; init; }
    public SearchAuthorDto? Author { get; init; }
    public DateTime CreatedAt { get; init; }
    public int ViewCount { get; init; }
    public int CommentCount { get; init; }
    public int AnswerCount { get; init; }
    public bool HasAcceptedAnswer { get; init; }
    public List<string> Tags { get; init; } = new();
    public double Relevance { get; init; }
}

public record SearchAuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}
