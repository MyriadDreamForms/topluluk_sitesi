using MediatR;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Posts.Queries.GetPostById;

public record GetPostByIdQuery(string Slug) : IRequest<PostDetailDto>;
