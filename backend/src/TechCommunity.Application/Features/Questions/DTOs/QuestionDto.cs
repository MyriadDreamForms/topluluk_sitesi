namespace TechCommunity.Application.Features.Questions.DTOs;

public class QuestionAuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

public class QuestionTagDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}

public class QuestionDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string BodyPreview { get; init; } = string.Empty;
    public int ViewCount { get; init; }
    public int AnswerCount { get; init; }
    public bool HasAcceptedAnswer { get; init; }
    public DateTime CreatedAt { get; init; }
    public QuestionAuthorDto Author { get; init; } = null!;
    public List<QuestionTagDto> Tags { get; init; } = new();
}
