using MediatR;

namespace TechCommunity.Application.Features.Questions.Commands.DeleteQuestion;

public record DeleteQuestionCommand(Guid Id) : IRequest<Unit>;
