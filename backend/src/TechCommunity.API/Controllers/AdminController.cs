using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Admin.Commands.BanUser;
using TechCommunity.Application.Features.Admin.Commands.HideContent;
using TechCommunity.Application.Features.Admin.Commands.UnbanUser;
using TechCommunity.Application.Features.Admin.Commands.UnhideContent;
using TechCommunity.Application.Features.Admin.Commands.UpdateUserRole;
using TechCommunity.Application.Features.Admin.Queries.GetUsers;

namespace TechCommunity.API.Controllers;

[Authorize(Policy = "AdminOrModerator")]
public class AdminController : BaseApiController
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all users with filtering and pagination (Admin/Moderator only)
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] bool? isBanned = null,
        [FromQuery] string sortBy = "createdAt",
        [FromQuery] bool sortDesc = true)
    {
        var query = new GetUsersQuery
        {
            Page = page,
            PageSize = pageSize,
            SearchTerm = search,
            Role = role,
            IsBanned = isBanned,
            SortBy = sortBy,
            SortDescending = sortDesc
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Update a user's role (Admin only)
    /// </summary>
    [HttpPatch("users/{userId}/role")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] UpdateUserRoleRequest request)
    {
        var command = new UpdateUserRoleCommand
        {
            UserId = userId,
            Role = request.Role
        };

        await _mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Ban a user (Admin/Moderator only)
    /// </summary>
    [HttpPost("users/{userId}/ban")]
    public async Task<IActionResult> BanUser(Guid userId, [FromBody] BanUserRequest request)
    {
        var command = new BanUserCommand
        {
            UserId = userId,
            Reason = request.Reason
        };

        await _mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Unban a user (Admin/Moderator only)
    /// </summary>
    [HttpPost("users/{userId}/unban")]
    public async Task<IActionResult> UnbanUser(Guid userId)
    {
        var command = new UnbanUserCommand { UserId = userId };
        await _mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Hide content (Admin/Moderator only)
    /// </summary>
    [HttpPost("content/hide")]
    public async Task<IActionResult> HideContent([FromBody] HideContentRequest request)
    {
        var command = new HideContentCommand
        {
            ContentType = request.ContentType,
            ContentId = request.ContentId,
            Reason = request.Reason
        };

        await _mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Unhide content (Admin/Moderator only)
    /// </summary>
    [HttpPost("content/unhide")]
    public async Task<IActionResult> UnhideContent([FromBody] UnhideContentRequest request)
    {
        var command = new UnhideContentCommand
        {
            ContentType = request.ContentType,
            ContentId = request.ContentId
        };

        await _mediator.Send(command);
        return NoContent();
    }
}

public record UpdateUserRoleRequest(string Role);
public record BanUserRequest(string? Reason);
public record HideContentRequest(string ContentType, Guid ContentId, string? Reason);
public record UnhideContentRequest(string ContentType, Guid ContentId);
