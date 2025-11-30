using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Feed.Queries.GetFeed;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class FeedController : BaseApiController
{
    /// <summary>
    /// Get the home feed with posts and questions
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetFeed(
        [FromQuery] string sort = "latest",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetFeedQuery
        {
            SortBy = sort,
            PageNumber = page,
            PageSize = pageSize
        };

        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
