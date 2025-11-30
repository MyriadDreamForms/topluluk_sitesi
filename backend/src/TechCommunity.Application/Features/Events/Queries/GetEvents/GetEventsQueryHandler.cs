using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Events.DTOs;

namespace TechCommunity.Application.Features.Events.Queries.GetEvents;

public class GetEventsQueryHandler : IRequestHandler<GetEventsQuery, PaginatedList<EventDto>>
{
    private readonly IApplicationDbContext _context;

    public GetEventsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<EventDto>> Handle(GetEventsQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        
        var query = _context.Events
            .Include(e => e.CreatedBy)
            .Where(e => e.IsPublished)
            .AsQueryable();

        // Apply filter
        query = request.Filter?.ToLower() switch
        {
            "upcoming" => query.Where(e => e.StartDate > now),
            "past" => query.Where(e => e.StartDate <= now),
            _ => query
        };

        // Order by start date (upcoming events first, then by date)
        query = request.Filter?.ToLower() == "past"
            ? query.OrderByDescending(e => e.StartDate)
            : query.OrderBy(e => e.StartDate);

        var totalCount = await query.CountAsync(cancellationToken);

        var events = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Slug = e.Slug,
                Description = e.Description.Length > 200 
                    ? e.Description.Substring(0, 200) + "..." 
                    : e.Description,
                EventType = e.EventType,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Location = e.Location,
                OnlineUrl = e.OnlineUrl,
                MaxAttendees = null,
                AttendeeCount = 0,
                OrganizerUsername = e.CreatedBy.Username,
                OrganizerDisplayName = e.CreatedBy.DisplayName ?? e.CreatedBy.Username,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PaginatedList<EventDto>(
            events,
            totalCount,
            request.Page,
            request.PageSize);
    }
}
