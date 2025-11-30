using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.Commands.DeleteEvent;

public class DeleteEventCommandHandler : IRequestHandler<DeleteEventCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteEventCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Etkinliği silmek için giriş yapmalısınız.");

        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Etkinlik bulunamadı.");

        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken)
            ?? throw new UnauthorizedException("Kullanıcı bulunamadı.");

        // Check if user is creator, admin, or moderator
        if (eventEntity.CreatedById != userId && user.Role != UserRole.Admin && user.Role != UserRole.Moderator)
        {
            throw new ForbiddenException("Bu etkinliği silme yetkiniz yok.");
        }

        _context.Events.Remove(eventEntity);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
