namespace TechCommunity.Application.Features.Answers.DTOs;

public class AnswerAuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

public class AnswerDto
{
    public Guid Id { get; init; }
    public string Body { get; init; } = string.Empty;
    public string? BodyHtml { get; init; }
    public Guid QuestionId { get; init; }
    public bool IsAccepted { get; init; }
    public int CommentCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public AnswerAuthorDto Author { get; init; } = null!;
    public bool IsAuthor { get; init; }
}
