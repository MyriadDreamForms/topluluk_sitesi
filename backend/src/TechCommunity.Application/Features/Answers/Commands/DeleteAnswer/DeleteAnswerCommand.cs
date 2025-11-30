using MediatR;

namespace TechCommunity.Application.Features.Answers.Commands.DeleteAnswer;

public record DeleteAnswerCommand(Guid Id) : IRequest<Unit>;
