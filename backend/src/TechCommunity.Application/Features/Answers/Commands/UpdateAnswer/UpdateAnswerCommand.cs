using MediatR;

namespace TechCommunity.Application.Features.Answers.Commands.UpdateAnswer;

public record UpdateAnswerCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string Body { get; init; } = string.Empty;
}
