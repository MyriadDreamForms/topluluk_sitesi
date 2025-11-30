using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Events.DTOs;

namespace TechCommunity.Application.Features.Events.Queries.GetEvents;

public record GetEventsQuery(
    string? Filter = null, // "upcoming", "past", "all"
    int Page = 1,
    int PageSize = 10
) : IRequest<PaginatedList<EventDto>>;
