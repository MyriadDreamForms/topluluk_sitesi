using MediatR;

namespace TechCommunity.Application.Features.Questions.Commands.UpdateQuestion;

public record UpdateQuestionCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public List<string> TagNames { get; init; } = new();
}
