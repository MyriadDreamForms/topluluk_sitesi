using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.API.Models;
using TechCommunity.Application.Common.Models;

namespace TechCommunity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    private ISender? _mediator;

    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    /// <summary>
    /// Creates a success response wrapper with data
    /// </summary>
    protected IActionResult Success<T>(T? data, string? message = null)
    {
        return Ok(new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        });
    }

    /// <summary>
    /// Creates a success response wrapper without data
    /// </summary>
    protected IActionResult Success(string? message = null)
    {
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = message
        });
    }

    /// <summary>
    /// Creates a paginated success response
    /// </summary>
    protected IActionResult SuccessPaginated<T>(PaginatedList<T> paginatedList, string? message = null)
    {
        return Ok(new PaginatedApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = new PaginatedData<T>
            {
                Items = paginatedList.Items,
                PageNumber = paginatedList.PageNumber,
                PageSize = paginatedList.PageSize,
                TotalCount = paginatedList.TotalCount,
                TotalPages = paginatedList.TotalPages,
                HasPreviousPage = paginatedList.HasPreviousPage,
                HasNextPage = paginatedList.HasNextPage
            }
        });
    }

    /// <summary>
    /// Creates an error response wrapper
    /// </summary>
    protected IActionResult Error(string message, IDictionary<string, string[]>? errors = null)
    {
        return BadRequest(new ApiResponse<object>
        {
            Success = false,
            Message = message,
            Errors = errors
        });
    }
}

/// <summary>
/// Paginated API response wrapper
/// </summary>
public class PaginatedApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public PaginatedData<T>? Data { get; set; }
}

/// <summary>
/// Paginated data container
/// </summary>
public class PaginatedData<T>
{
    public IReadOnlyList<T> Items { get; set; } = [];
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
}
