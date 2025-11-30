using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserPosts;

public record GetUserPostsQuery(string Username, int Page = 1, int PageSize = 10) : IRequest<PaginatedList<PostDto>>;
