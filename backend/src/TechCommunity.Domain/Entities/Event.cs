using TechCommunity.Domain.Common;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Domain.Entities;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? DescriptionHtml { get; set; }
    public EventType EventType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public string? OnlineUrl { get; set; }
    public string? ImageUrl { get; set; }
    public Guid CreatedById { get; set; }
    public bool IsPublished { get; set; } = true;

    // Navigation properties
    public virtual User CreatedBy { get; set; } = null!;
}
