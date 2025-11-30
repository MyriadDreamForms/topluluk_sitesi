using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Features.Events.DTOs;

namespace TechCommunity.Application.Features.Events.Queries.GetEventById;

public class GetEventByIdQueryHandler : IRequestHandler<GetEventByIdQuery, EventDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetEventByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EventDetailDto> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
    {
        var eventEntity = await _context.Events
            .Include(e => e.CreatedBy)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Etkinlik bulunamadı.");

        return MapToDto(eventEntity);
    }

    private static EventDetailDto MapToDto(Domain.Entities.Event e)
    {
        return new EventDetailDto
        {
            Id = e.Id,
            Title = e.Title,
            Slug = e.Slug,
            Description = e.Description,
            DescriptionHtml = e.DescriptionHtml ?? e.Description,
            EventType = e.EventType,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Location = e.Location,
            OnlineUrl = e.OnlineUrl,
            MaxAttendees = null,
            AttendeeCount = 0,
            Organizer = new EventOrganizerDto
            {
                Id = e.CreatedBy.Id,
                Username = e.CreatedBy.Username,
                DisplayName = e.CreatedBy.DisplayName ?? e.CreatedBy.Username,
                AvatarUrl = e.CreatedBy.AvatarUrl
            },
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        };
    }
}

public class GetEventBySlugQueryHandler : IRequestHandler<GetEventBySlugQuery, EventDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetEventBySlugQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EventDetailDto> Handle(GetEventBySlugQuery request, CancellationToken cancellationToken)
    {
        var eventEntity = await _context.Events
            .Include(e => e.CreatedBy)
            .FirstOrDefaultAsync(e => e.Slug == request.Slug, cancellationToken)
            ?? throw new NotFoundException("Etkinlik bulunamadı.");

        return new EventDetailDto
        {
            Id = eventEntity.Id,
            Title = eventEntity.Title,
            Slug = eventEntity.Slug,
            Description = eventEntity.Description,
            DescriptionHtml = eventEntity.DescriptionHtml ?? eventEntity.Description,
            EventType = eventEntity.EventType,
            StartDate = eventEntity.StartDate,
            EndDate = eventEntity.EndDate,
            Location = eventEntity.Location,
            OnlineUrl = eventEntity.OnlineUrl,
            MaxAttendees = null,
            AttendeeCount = 0,
            Organizer = new EventOrganizerDto
            {
                Id = eventEntity.CreatedBy.Id,
                Username = eventEntity.CreatedBy.Username,
                DisplayName = eventEntity.CreatedBy.DisplayName ?? eventEntity.CreatedBy.Username,
                AvatarUrl = eventEntity.CreatedBy.AvatarUrl
            },
            CreatedAt = eventEntity.CreatedAt,
            UpdatedAt = eventEntity.UpdatedAt
        };
    }
}
