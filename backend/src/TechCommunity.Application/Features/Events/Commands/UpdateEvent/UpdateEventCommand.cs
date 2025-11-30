using MediatR;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.Commands.UpdateEvent;

public record UpdateEventCommand(
    Guid Id,
    string Title,
    string Description,
    EventType EventType,
    DateTime StartDate,
    DateTime? EndDate,
    string? Location,
    string? OnlineUrl
) : IRequest<Unit>;
