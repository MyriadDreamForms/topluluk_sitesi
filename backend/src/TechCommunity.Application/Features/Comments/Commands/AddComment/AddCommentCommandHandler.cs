using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Comments.DTOs;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Features.Comments.Commands.AddComment;

public class AddCommentCommandHandler : IRequestHandler<AddCommentCommand, CommentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddCommentCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<CommentDto> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId 
            ?? throw new UnauthorizedException("Kullanıcı oturumu geçersiz.");

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new UnauthorizedException("Kullanıcı bulunamadı.");

        // Verify the target exists
        if (request.PostId.HasValue)
        {
            var postExists = await _context.Posts
                .AnyAsync(p => p.Id == request.PostId.Value && !p.IsDeleted, cancellationToken);
            if (!postExists)
            {
                throw new NotFoundException("Post", request.PostId.Value);
            }
        }

        if (request.QuestionId.HasValue)
        {
            var questionExists = await _context.Questions
                .AnyAsync(q => q.Id == request.QuestionId.Value && !q.IsDeleted, cancellationToken);
            if (!questionExists)
            {
                throw new NotFoundException("Question", request.QuestionId.Value);
            }
        }

        // Verify parent comment exists if provided
        if (request.ParentId.HasValue)
        {
            var parentExists = await _context.Comments
                .AnyAsync(c => c.Id == request.ParentId.Value && !c.IsDeleted, cancellationToken);
            if (!parentExists)
            {
                throw new NotFoundException("Comment", request.ParentId.Value);
            }
        }

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = request.Content,
            PostId = request.PostId,
            QuestionId = request.QuestionId,
            ParentId = request.ParentId,
            AuthorId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            Author = new DTOs.AuthorDto
            {
                Id = user.Id,
                Username = user.Username,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl
            },
            ParentId = comment.ParentId,
            ReplyCount = 0,
            IsAuthor = true
        };
    }
}
