using MediatR;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserProfile;

public record GetUserProfileQuery(string Username) : IRequest<UserProfileDto>;
