using MediatR;
using TechCommunity.Application.Features.Tags.DTOs;

namespace TechCommunity.Application.Features.Tags.Queries.GetTagBySlug;

public record GetTagBySlugQuery(string Slug) : IRequest<TagDto>;
