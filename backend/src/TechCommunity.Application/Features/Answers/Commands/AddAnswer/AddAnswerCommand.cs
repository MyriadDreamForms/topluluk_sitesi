using MediatR;

namespace TechCommunity.Application.Features.Answers.Commands.AddAnswer;

public record AddAnswerCommand : IRequest<Guid>
{
    public Guid QuestionId { get; init; }
    public string Body { get; init; } = string.Empty;
}
