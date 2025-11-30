using MediatR;
using TechCommunity.Application.Features.Tags.DTOs;

namespace TechCommunity.Application.Features.Tags.Queries.GetTags;

public record GetTagsQuery : IRequest<List<TagDto>>
{
    public string? Search { get; init; }
    public int? Limit { get; init; }
    public bool Popular { get; init; } = false;
}
