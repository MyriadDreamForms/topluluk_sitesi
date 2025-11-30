using MediatR;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Commands.UpdateProfile;

public record UpdateProfileCommand(
    string? DisplayName,
    string? Bio,
    string? GitHubUrl,
    string? TwitterUrl,
    string? LinkedInUrl,
    string? WebsiteUrl
) : IRequest<UserProfileDto>;
