using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.Commands.UpdateEvent;

public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMarkdownService _markdownService;

    public UpdateEventCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IMarkdownService markdownService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _markdownService = markdownService;
    }

    public async Task<Unit> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Etkinliği güncellemek için giriş yapmalısınız.");

        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Etkinlik bulunamadı.");

        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken)
            ?? throw new UnauthorizedException("Kullanıcı bulunamadı.");

        // Check if user is creator, admin, or moderator
        if (eventEntity.CreatedById != userId && user.Role != UserRole.Admin && user.Role != UserRole.Moderator)
        {
            throw new ForbiddenException("Bu etkinliği güncelleme yetkiniz yok.");
        }

        eventEntity.Title = request.Title;
        eventEntity.Description = request.Description;
        eventEntity.DescriptionHtml = _markdownService.ToHtml(request.Description);
        eventEntity.EventType = request.EventType;
        eventEntity.StartDate = request.StartDate;
        eventEntity.EndDate = request.EndDate;
        eventEntity.Location = request.Location;
        eventEntity.OnlineUrl = request.OnlineUrl;
        eventEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
