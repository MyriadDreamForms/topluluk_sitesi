using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.DTOs;

public class EventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public EventType EventType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public string? OnlineUrl { get; set; }
    public int? MaxAttendees { get; set; }
    public int AttendeeCount { get; set; }
    public string OrganizerUsername { get; set; } = string.Empty;
    public string OrganizerDisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsUpcoming => StartDate > DateTime.UtcNow;
}
