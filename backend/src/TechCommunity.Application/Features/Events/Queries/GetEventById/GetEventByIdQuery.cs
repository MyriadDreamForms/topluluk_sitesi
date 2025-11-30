using MediatR;
using TechCommunity.Application.Features.Events.DTOs;

namespace TechCommunity.Application.Features.Events.Queries.GetEventById;

public record GetEventByIdQuery(Guid Id) : IRequest<EventDetailDto>;

public record GetEventBySlugQuery(string Slug) : IRequest<EventDetailDto>;
