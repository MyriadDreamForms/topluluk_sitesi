using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Admin.Commands.BanUser;

public class BanUserCommandHandler : IRequestHandler<BanUserCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public BanUserCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(BanUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User", request.UserId);
        }

        // Prevent self-ban
        if (user.Id == _currentUserService.UserId)
        {
            throw new ForbiddenException("You cannot ban yourself");
        }

        // Prevent banning admins (only other admins can ban admins, and only if they're a higher level)
        if (user.Role == Domain.Enums.UserRole.Admin)
        {
            throw new ForbiddenException("Administrators cannot be banned");
        }

        user.IsBanned = true;
        user.BanReason = request.Reason;
        user.BannedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        // Invalidate all refresh tokens for this user by setting RevokedAt
        var refreshTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (var token in refreshTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
