using System.Net;
using System.Text.Json;
using TechCommunity.API.Models;
using TechCommunity.Application.Common.Exceptions;

namespace TechCommunity.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        var apiResponse = exception switch
        {
            ValidationException validationEx => new
            {
                Success = false,
                Message = "Validation failed",
                Errors = validationEx.Errors,
                StatusCode = (int)HttpStatusCode.BadRequest
            },
            NotFoundException notFoundEx => new
            {
                Success = false,
                Message = notFoundEx.Message,
                Errors = (IDictionary<string, string[]>?)null,
                StatusCode = (int)HttpStatusCode.NotFound
            },
            UnauthorizedException unauthorizedEx => new
            {
                Success = false,
                Message = unauthorizedEx.Message,
                Errors = (IDictionary<string, string[]>?)null,
                StatusCode = (int)HttpStatusCode.Unauthorized
            },
            ForbiddenException forbiddenEx => new
            {
                Success = false,
                Message = forbiddenEx.Message,
                Errors = (IDictionary<string, string[]>?)null,
                StatusCode = (int)HttpStatusCode.Forbidden
            },
            _ => new
            {
                Success = false,
                Message = "An error occurred while processing your request.",
                Errors = (IDictionary<string, string[]>?)null,
                StatusCode = (int)HttpStatusCode.InternalServerError
            }
        };

        if (apiResponse.StatusCode == (int)HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception occurred");
        }

        response.StatusCode = apiResponse.StatusCode;

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await response.WriteAsync(JsonSerializer.Serialize(new
        {
            apiResponse.Success,
            apiResponse.Message,
            apiResponse.Errors
        }, jsonOptions));
    }
}

public static class ExceptionHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}
