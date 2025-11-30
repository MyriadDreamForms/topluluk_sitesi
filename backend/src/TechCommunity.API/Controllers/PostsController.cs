using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Posts.Commands.CreatePost;
using TechCommunity.Application.Features.Posts.Commands.DeletePost;
using TechCommunity.Application.Features.Posts.Commands.UpdatePost;
using TechCommunity.Application.Features.Posts.Queries.GetPostById;
using TechCommunity.Application.Features.Posts.Queries.GetPosts;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class PostsController : BaseApiController
{
    /// <summary>
    /// Get paginated list of posts
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPosts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? tag = null,
        [FromQuery] string? authorUsername = null,
        [FromQuery] bool? isFeatured = null,
        [FromQuery] string sortBy = "latest")
    {
        var query = new GetPostsQuery
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 50), // Cap at 50
            Search = search,
            Tag = tag,
            AuthorUsername = authorUsername,
            IsFeatured = isFeatured,
            SortBy = sortBy
        };

        var result = await Mediator.Send(query);
        return SuccessPaginated(result);
    }

    /// <summary>
    /// Get post by slug
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetPost(string slug)
    {
        var result = await Mediator.Send(new GetPostByIdQuery(slug));
        return Success(result);
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result, "Yazı başarıyla oluşturuldu.");
    }

    /// <summary>
    /// Update an existing post
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdatePostCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID uyuşmazlığı." });
        }

        var result = await Mediator.Send(command);
        return Success(result, "Yazı başarıyla güncellendi.");
    }

    /// <summary>
    /// Delete a post (soft delete)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        await Mediator.Send(new DeletePostCommand(id));
        return Success("Yazı başarıyla silindi.");
    }
}
