using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Commands.UpdateProfile;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProfileCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<UserProfileDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        
        if (userId == null)
        {
            throw new UnauthorizedException("Kullanıcı girişi yapılmamış.");
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        // Update only non-null values
        if (request.DisplayName != null)
            user.DisplayName = request.DisplayName;
        
        if (request.Bio != null)
            user.Bio = string.IsNullOrWhiteSpace(request.Bio) ? null : request.Bio;
        
        if (request.GitHubUrl != null)
            user.GitHubUrl = string.IsNullOrWhiteSpace(request.GitHubUrl) ? null : request.GitHubUrl;
        
        if (request.TwitterUrl != null)
            user.TwitterUrl = string.IsNullOrWhiteSpace(request.TwitterUrl) ? null : request.TwitterUrl;
        
        if (request.LinkedInUrl != null)
            user.LinkedInUrl = string.IsNullOrWhiteSpace(request.LinkedInUrl) ? null : request.LinkedInUrl;
        
        if (request.WebsiteUrl != null)
            user.WebsiteUrl = string.IsNullOrWhiteSpace(request.WebsiteUrl) ? null : request.WebsiteUrl;

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
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
            LastLoginAt = user.LastLoginAt
        };
    }
}
