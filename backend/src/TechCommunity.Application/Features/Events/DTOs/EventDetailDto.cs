using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.DTOs;

public class EventDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionHtml { get; set; } = string.Empty;
    public EventType EventType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public string? OnlineUrl { get; set; }
    public int? MaxAttendees { get; set; }
    public int AttendeeCount { get; set; }
    public bool IsFull => MaxAttendees.HasValue && AttendeeCount >= MaxAttendees.Value;
    public bool IsUpcoming => StartDate > DateTime.UtcNow;
    public bool IsOngoing => StartDate <= DateTime.UtcNow && (!EndDate.HasValue || EndDate.Value > DateTime.UtcNow);
    
    public EventOrganizerDto Organizer { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class EventOrganizerDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}
