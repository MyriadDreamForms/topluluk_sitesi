namespace TechCommunity.API.Middleware;

/// <summary>
/// Middleware that adds security headers to HTTP responses
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SecurityHeadersMiddleware> _logger;

    public SecurityHeadersMiddleware(
        RequestDelegate next,
        IConfiguration configuration,
        ILogger<SecurityHeadersMiddleware> logger)
    {
        _next = next;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Content Security Policy
        // Restrictive for API responses - only allows same-origin
        context.Response.Headers.Append("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self'; " +
            "frame-ancestors 'none'; " +
            "form-action 'self'; " +
            "base-uri 'self';");

        // X-Content-Type-Options: Prevent MIME type sniffing
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

        // X-Frame-Options: Prevent clickjacking (legacy, CSP frame-ancestors is preferred)
        context.Response.Headers.Append("X-Frame-Options", "DENY");

        // X-XSS-Protection: Enable XSS filtering in older browsers
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

        // Referrer-Policy: Control how much referrer info is sent
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions-Policy: Restrict browser features
        context.Response.Headers.Append("Permissions-Policy", 
            "accelerometer=(), " +
            "camera=(), " +
            "geolocation=(), " +
            "gyroscope=(), " +
            "magnetometer=(), " +
            "microphone=(), " +
            "payment=(), " +
            "usb=()");

        // Cache-Control for API responses
        if (!context.Response.Headers.ContainsKey("Cache-Control"))
        {
            context.Response.Headers.Append("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            context.Response.Headers.Append("Pragma", "no-cache");
        }

        await _next(context);
    }
}

/// <summary>
/// Extension methods for SecurityHeadersMiddleware
/// </summary>
public static class SecurityHeadersMiddlewareExtensions
{
    /// <summary>
    /// Adds security headers middleware to the application pipeline
    /// </summary>
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<SecurityHeadersMiddleware>();
    }
}
