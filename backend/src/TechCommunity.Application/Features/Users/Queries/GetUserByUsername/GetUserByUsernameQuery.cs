using MediatR;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserByUsername;

public record GetUserByUsernameQuery(string Username) : IRequest<PublicUserProfileDto>;
