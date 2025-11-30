using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Auth.Commands.Logout;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public LogoutCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        // Find the refresh token
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken, cancellationToken);

        if (storedToken != null && storedToken.RevokedAt == null)
        {
            // Revoke all tokens in this family
            var tokensInFamily = await _context.RefreshTokens
                .Where(rt => rt.TokenFamily == storedToken.TokenFamily && rt.RevokedAt == null)
                .ToListAsync(cancellationToken);

            foreach (var token in tokensInFamily)
            {
                token.RevokedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }

        return Unit.Value;
    }
}
