using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Users.Commands.UpdateProfile;
using TechCommunity.Application.Features.Users.Commands.UploadAvatar;
using TechCommunity.Application.Features.Users.DTOs;
using TechCommunity.Application.Features.Users.Queries.GetCurrentUser;
using TechCommunity.Application.Features.Users.Queries.GetUserByUsername;
using TechCommunity.Application.Features.Users.Queries.GetUserPosts;
using TechCommunity.Application.Features.Users.Queries.GetUserProfile;
using TechCommunity.Application.Features.Users.Queries.GetUserQuestions;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class UsersController : BaseApiController
{
    /// <summary>
    /// Mevcut kullanıcı bilgilerini getirir
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var result = await Mediator.Send(new GetCurrentUserQuery());
        return Ok(Success(result));
    }

    /// <summary>
    /// Kullanıcı profilini kullanıcı adına göre getirir (Private)
    /// </summary>
    [HttpGet("{username}")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserProfile(string username)
    {
        var result = await Mediator.Send(new GetUserProfileQuery(username));
        return Ok(Success(result));
    }

    /// <summary>
    /// Kullanıcı profilini günceller
    /// </summary>
    [HttpPut("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(Success(result, "Profil başarıyla güncellendi."));
    }

    /// <summary>
    /// Avatar yükler
    /// </summary>
    [HttpPost("me/avatar")]
    [Authorize]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
    {
        var result = await Mediator.Send(new UploadAvatarCommand(file));
        return Ok(Success(result, "Avatar başarıyla yüklendi."));
    }

    /// <summary>
    /// Public kullanıcı profili getirir (başka kullanıcılar için)
    /// </summary>
    [HttpGet("{username}/public")]
    [ProducesResponseType(typeof(PublicUserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPublicProfile(string username)
    {
        var result = await Mediator.Send(new GetUserByUsernameQuery(username));
        return Ok(Success(result));
    }

    /// <summary>
    /// Kullanıcının yazılarını getirir
    /// </summary>
    [HttpGet("{username}/posts")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserPosts(string username, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await Mediator.Send(new GetUserPostsQuery(username, page, pageSize));
        return Ok(Success(result));
    }

    /// <summary>
    /// Kullanıcının sorularını getirir
    /// </summary>
    [HttpGet("{username}/questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserQuestions(string username, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await Mediator.Send(new GetUserQuestionsQuery(username, page, pageSize));
        return Ok(Success(result));
    }
}
