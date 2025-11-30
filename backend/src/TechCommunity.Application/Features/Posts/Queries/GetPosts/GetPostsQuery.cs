using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Posts.Queries.GetPosts;

public record GetPostsQuery : IRequest<PaginatedList<PostDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Tag { get; init; }
    public string? AuthorUsername { get; init; }
    public bool? IsFeatured { get; init; }
    public string SortBy { get; init; } = "latest"; // latest, popular, trending
}
