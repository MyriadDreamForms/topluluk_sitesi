using Microsoft.AspNetCore.Mvc;

namespace TechCommunity.API.Controllers;

public class HealthController : BaseApiController
{
    [HttpGet("/health")]
    public IActionResult Health()
    {
        return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow });
    }

    [HttpGet("/api/health")]
    public IActionResult ApiHealth()
    {
        return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow, Version = "1.0.0" });
    }
}
