using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserProfile;

public class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, UserProfileDto>
{
    private readonly IApplicationDbContext _context;

    public GetUserProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileDto> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower(), cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User", request.Username);
        }

        // Don't expose email for other users
        return new UserProfileDto
        {
            Id = user.Id,
            Email = null, // Don't expose email
            Username = user.Username,
            DisplayName = user.DisplayName,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            GitHubUrl = user.GitHubUrl,
            TwitterUrl = user.TwitterUrl,
            LinkedInUrl = user.LinkedInUrl,
            WebsiteUrl = user.WebsiteUrl,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt,
            LastLoginAt = null // Don't expose last login
        };
    }
}
