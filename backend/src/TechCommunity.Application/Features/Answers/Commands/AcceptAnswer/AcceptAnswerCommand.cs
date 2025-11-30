using MediatR;

namespace TechCommunity.Application.Features.Answers.Commands.AcceptAnswer;

public record AcceptAnswerCommand(Guid AnswerId) : IRequest<Unit>;
