using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Admin.Commands.UnbanUser;

public class UnbanUserCommandHandler : IRequestHandler<UnbanUserCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UnbanUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UnbanUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User", request.UserId);
        }

        user.IsBanned = false;
        user.BanReason = null;
        user.BannedAt = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
