namespace TechCommunity.Application.Features.Tags.DTOs;

public record TagDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int PostCount { get; init; }
    public int QuestionCount { get; init; }
    public int TotalCount => PostCount + QuestionCount;
}
