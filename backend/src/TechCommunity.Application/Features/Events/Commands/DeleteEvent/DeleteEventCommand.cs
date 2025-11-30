using MediatR;

namespace TechCommunity.Application.Features.Events.Commands.DeleteEvent;

public record DeleteEventCommand(Guid Id) : IRequest<Unit>;
