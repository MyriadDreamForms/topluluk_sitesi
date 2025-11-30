namespace TechCommunity.Application.Features.Questions.DTOs;

public class QuestionDetailDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public string? BodyHtml { get; init; }
    public int ViewCount { get; init; }
    public int AnswerCount { get; init; }
    public Guid? AcceptedAnswerId { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public QuestionAuthorDto Author { get; init; } = null!;
    public List<QuestionTagDto> Tags { get; init; } = new();
    public bool IsAuthor { get; init; }
}
