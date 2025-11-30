using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Events.Commands.CreateEvent;
using TechCommunity.Application.Features.Events.Commands.UpdateEvent;
using TechCommunity.Application.Features.Events.Commands.DeleteEvent;
using TechCommunity.Application.Features.Events.Queries.GetEvents;
using TechCommunity.Application.Features.Events.Queries.GetEventById;

namespace TechCommunity.API.Controllers;

/// <summary>
/// Controller for managing events
/// </summary>
public class EventsController : BaseApiController
{
    /// <summary>
    /// Get list of events with optional filter
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetEvents(
        [FromQuery] string? filter = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await Mediator.Send(new GetEventsQuery(filter, page, pageSize));
        return SuccessPaginated(result);
    }

    /// <summary>
    /// Get upcoming events for home widget
    /// </summary>
    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingEvents([FromQuery] int limit = 5)
    {
        var result = await Mediator.Send(new GetEventsQuery("upcoming", 1, limit));
        return Success(result.Items);
    }

    /// <summary>
    /// Get event by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetEventById(Guid id)
    {
        var result = await Mediator.Send(new GetEventByIdQuery(id));
        return Success(result);
    }

    /// <summary>
    /// Get event by slug
    /// </summary>
    [HttpGet("by-slug/{slug}")]
    public async Task<IActionResult> GetEventBySlug(string slug)
    {
        var result = await Mediator.Send(new GetEventBySlugQuery(slug));
        return Success(result);
    }

    /// <summary>
    /// Create a new event (Admin/Moderator only)
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventCommand command)
    {
        var eventId = await Mediator.Send(command);
        return CreatedAtAction(nameof(GetEventById), new { id = eventId }, new { id = eventId });
    }

    /// <summary>
    /// Update an existing event
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventRequest request)
    {
        var command = new UpdateEventCommand(
            id,
            request.Title,
            request.Description,
            request.EventType,
            request.StartDate,
            request.EndDate,
            request.Location,
            request.OnlineUrl);

        await Mediator.Send(command);
        return Success("Etkinlik başarıyla güncellendi.");
    }

    /// <summary>
    /// Delete an event
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        await Mediator.Send(new DeleteEventCommand(id));
        return Success("Etkinlik başarıyla silindi.");
    }
}

/// <summary>
/// Request model for updating event
/// </summary>
public class UpdateEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TechCommunity.Domain.Enums.EventType EventType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public string? OnlineUrl { get; set; }
}
