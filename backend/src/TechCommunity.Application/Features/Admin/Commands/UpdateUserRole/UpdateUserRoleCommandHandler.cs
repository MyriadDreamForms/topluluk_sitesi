using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Admin.Commands.UpdateUserRole;

public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserRoleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("User", request.UserId);
        }

        if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
        {
            throw new ValidationException("Role", $"Invalid role: {request.Role}. Valid roles are: User, Moderator, Admin");
        }

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
