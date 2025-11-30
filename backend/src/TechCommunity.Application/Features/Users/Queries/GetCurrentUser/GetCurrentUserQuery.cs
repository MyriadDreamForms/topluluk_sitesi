using MediatR;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetCurrentUser;

public record GetCurrentUserQuery : IRequest<UserProfileDto>;
