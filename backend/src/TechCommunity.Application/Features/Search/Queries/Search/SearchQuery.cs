using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Search.DTOs;

namespace TechCommunity.Application.Features.Search.Queries.Search;

public record SearchQuery : IRequest<PaginatedList<SearchResultDto>>
{
    public string Query { get; init; } = string.Empty;
    public string? Type { get; init; } // "posts", "questions", "users", null = all
    public string? Tag { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
