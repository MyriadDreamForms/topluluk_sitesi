using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Tags.Queries.GetTags;
using TechCommunity.Application.Features.Tags.Queries.GetTagBySlug;
using TechCommunity.Application.Features.Tags.Queries.GetTagContent;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class TagsController : BaseApiController
{
    /// <summary>
    /// Get all tags with optional filtering
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTags(
        [FromQuery] string? search,
        [FromQuery] int? limit,
        [FromQuery] bool popular = false,
        CancellationToken cancellationToken = default)
    {
        var query = new GetTagsQuery
        {
            Search = search,
            Limit = limit,
            Popular = popular
        };

        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific tag by slug
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetTagBySlug(string slug, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new GetTagBySlugQuery(slug), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get content (posts and questions) for a specific tag
    /// </summary>
    [HttpGet("{slug}/content")]
    public async Task<IActionResult> GetTagContent(
        string slug,
        [FromQuery] string type = "all",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetTagContentQuery
        {
            Slug = slug,
            ContentType = type,
            PageNumber = page,
            PageSize = pageSize
        };

        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
