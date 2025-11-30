using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Comments.DTOs;

namespace TechCommunity.Application.Features.Comments.Commands.UpdateComment;

public class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, CommentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCommentCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<CommentDto> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Kullanıcı oturumu geçersiz.");

        var comment = await _context.Comments
            .Include(c => c.Author)
            .FirstOrDefaultAsync(c => c.Id == request.Id && !c.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Comment", request.Id);

        // Check ownership or admin role
        if (comment.AuthorId != userId)
        {
            var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
            if (user?.Role != Domain.Enums.UserRole.Admin && user?.Role != Domain.Enums.UserRole.Moderator)
            {
                throw new ForbiddenException("Bu yorumu düzenleme yetkiniz yok.");
            }
        }

        comment.Content = request.Content;
        comment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Get reply count
        var replyCount = await _context.Comments
            .CountAsync(c => c.ParentId == comment.Id && !c.IsDeleted, cancellationToken);

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt,
            Author = new DTOs.AuthorDto
            {
                Id = comment.Author.Id,
                Username = comment.Author.Username,
                DisplayName = comment.Author.DisplayName,
                AvatarUrl = comment.Author.AvatarUrl
            },
            ParentId = comment.ParentId,
            ReplyCount = replyCount,
            IsAuthor = comment.AuthorId == userId
        };
    }
}
