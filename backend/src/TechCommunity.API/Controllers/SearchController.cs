using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TechCommunity.Application.Features.Search.Queries.Search;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class SearchController : BaseApiController
{
    /// <summary>
    /// Search across posts, questions, and users
    /// </summary>
    [HttpGet]
    [EnableRateLimiting("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] string? type,
        [FromQuery] string? tag,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new SearchQuery
        {
            Query = q ?? string.Empty,
            Type = type,
            Tag = tag,
            PageNumber = page,
            PageSize = pageSize
        };

        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
