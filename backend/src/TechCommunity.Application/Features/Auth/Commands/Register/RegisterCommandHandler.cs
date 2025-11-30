using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Domain.Entities;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower(), cancellationToken);
        
        if (emailExists)
        {
            throw new ValidationException("Email", "Bu e-posta adresi zaten kullanımda.");
        }

        // Check if username already exists
        var usernameExists = await _context.Users
            .AnyAsync(u => u.Username.ToLower() == request.Username.ToLower(), cancellationToken);
        
        if (usernameExists)
        {
            throw new ValidationException("Username", "Bu kullanıcı adı zaten kullanımda.");
        }

        // Create user
        var user = new User
        {
            Email = request.Email.ToLower(),
            Username = request.Username,
            DisplayName = request.DisplayName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.User,
            IsBanned = false
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Generate tokens
        var (accessToken, refreshToken, expiresIn) = await _jwtService.GenerateTokensAsync(user);

        return new AuthResult
        {
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                AvatarUrl = user.AvatarUrl,
                Role = user.Role.ToString()
            },
            Tokens = new TokensDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = expiresIn
            }
        };
    }
}
