using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Posts.Commands.DeletePost;

public class DeletePostCommandHandler : IRequestHandler<DeletePostCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeletePostCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Kullanıcı oturumu geçersiz.");

        var post = await _context.Posts
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Post", request.Id);

        // Check ownership or admin role
        if (post.AuthorId != userId)
        {
            var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
            if (user?.Role != Domain.Enums.UserRole.Admin && user?.Role != Domain.Enums.UserRole.Moderator)
            {
                throw new ForbiddenException("Bu yazıyı silme yetkiniz yok.");
            }
        }

        // Soft delete - just mark as deleted
        post.IsDeleted = true;
        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
