namespace TechCommunity.Application.Features.Comments.DTOs;

public record CommentDto
{
    public Guid Id { get; init; }
    public string Content { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public AuthorDto Author { get; init; } = null!;
    public Guid? ParentId { get; init; }
    public int ReplyCount { get; init; }
    public bool IsAuthor { get; init; }
}

public record AuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}
