using MediatR;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.Commands.CreateEvent;

public record CreateEventCommand(
    string Title,
    string Description,
    EventType EventType,
    DateTime StartDate,
    DateTime? EndDate,
    string? Location,
    string? OnlineUrl
) : IRequest<Guid>;
