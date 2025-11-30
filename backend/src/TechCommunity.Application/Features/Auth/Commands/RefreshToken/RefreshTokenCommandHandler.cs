using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Auth.Commands.Register;

namespace TechCommunity.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Find the refresh token
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken, cancellationToken);

        if (storedToken == null)
        {
            throw new UnauthorizedException("Geçersiz veya süresi dolmuş token.");
        }

        // Check if token is expired
        if (storedToken.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedException("Geçersiz veya süresi dolmuş token.");
        }

        // Check if token is already revoked
        if (storedToken.RevokedAt != null)
        {
            // Potential token reuse attack - revoke all tokens in this family
            await RevokeTokenFamily(storedToken.TokenFamily, cancellationToken);
            throw new UnauthorizedException("Token güvenlik ihlali tespit edildi. Lütfen tekrar giriş yapın.");
        }

        var user = storedToken.User;

        // Check if user is banned
        if (user.IsBanned)
        {
            throw new ForbiddenException($"Hesabınız yasaklanmıştır. Neden: {user.BanReason ?? "Belirtilmemiş"}");
        }

        // Generate new tokens (this will also revoke the old one)
        var (accessToken, newRefreshToken, expiresIn) = await _jwtService.GenerateTokensAsync(user, storedToken.TokenFamily, storedToken.Id);

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
                RefreshToken = newRefreshToken,
                ExpiresIn = expiresIn
            }
        };
    }

    private async Task RevokeTokenFamily(Guid tokenFamily, CancellationToken cancellationToken)
    {
        var tokensInFamily = await _context.RefreshTokens
            .Where(rt => rt.TokenFamily == tokenFamily && rt.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (var token in tokensInFamily)
        {
            token.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
