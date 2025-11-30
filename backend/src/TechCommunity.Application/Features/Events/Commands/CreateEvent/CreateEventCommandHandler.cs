using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Domain.Entities;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.Commands.CreateEvent;

public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ISlugService _slugService;
    private readonly IMarkdownService _markdownService;

    public CreateEventCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ISlugService slugService,
        IMarkdownService markdownService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _slugService = slugService;
        _markdownService = markdownService;
    }

    public async Task<Guid> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Etkinlik oluşturmak için giriş yapmalısınız.");

        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken)
            ?? throw new UnauthorizedException("Kullanıcı bulunamadı.");

        // Only admins and moderators can create events
        if (user.Role != UserRole.Admin && user.Role != UserRole.Moderator)
        {
            throw new ForbiddenException("Sadece yöneticiler ve moderatörler etkinlik oluşturabilir.");
        }

        var baseSlug = _slugService.GenerateSlug(request.Title);
        var slug = await GenerateUniqueSlugAsync(baseSlug, cancellationToken);
        var descriptionHtml = _markdownService.ToHtml(request.Description);

        var eventEntity = new Event
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Slug = slug,
            Description = request.Description,
            DescriptionHtml = descriptionHtml,
            EventType = request.EventType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Location = request.Location,
            OnlineUrl = request.OnlineUrl,
            CreatedById = userId,
            CreatedAt = DateTime.UtcNow,
            IsPublished = true
        };

        _context.Events.Add(eventEntity);
        await _context.SaveChangesAsync(cancellationToken);

        return eventEntity.Id;
    }

    private async Task<string> GenerateUniqueSlugAsync(string baseSlug, CancellationToken cancellationToken)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _context.Events.AnyAsync(e => e.Slug == slug, cancellationToken))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }
}
