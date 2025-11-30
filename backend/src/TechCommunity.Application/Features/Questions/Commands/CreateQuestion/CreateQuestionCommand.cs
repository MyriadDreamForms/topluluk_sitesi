using MediatR;

namespace TechCommunity.Application.Features.Questions.Commands.CreateQuestion;

public record CreateQuestionCommand : IRequest<Guid>
{
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public List<string> TagNames { get; init; } = new();
}
