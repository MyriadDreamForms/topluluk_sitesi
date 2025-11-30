using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Feed.DTOs;

namespace TechCommunity.Application.Features.Feed.Queries.GetFeed;

public record GetFeedQuery : IRequest<PaginatedList<FeedItemDto>>
{
    public string SortBy { get; init; } = "latest"; // "latest", "popular", "trending"
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
