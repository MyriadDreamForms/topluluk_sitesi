using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Admin.Commands.UnhideContent;

public class UnhideContentCommandHandler : IRequestHandler<UnhideContentCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UnhideContentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UnhideContentCommand request, CancellationToken cancellationToken)
    {
        switch (request.ContentType.ToLower())
        {
            case "post":
                await UnhidePost(request.ContentId, cancellationToken);
                break;
            case "question":
                await UnhideQuestion(request.ContentId, cancellationToken);
                break;
            case "comment":
                await UnhideComment(request.ContentId, cancellationToken);
                break;
            case "answer":
                throw new ValidationException("ContentType", "Answers cannot be unhidden once removed. Please ask the author to re-post.");
            default:
                throw new ValidationException("ContentType", $"Invalid content type: {request.ContentType}. Valid types are: Post, Question, Comment");
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    private async Task UnhidePost(Guid postId, CancellationToken cancellationToken)
    {
        var post = await _context.Posts
            .FirstOrDefaultAsync(p => p.Id == postId, cancellationToken);

        if (post == null)
        {
            throw new NotFoundException("Post", postId);
        }

        post.IsPublished = true;
        post.UpdatedAt = DateTime.UtcNow;
    }

    private async Task UnhideQuestion(Guid questionId, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == questionId, cancellationToken);

        if (question == null)
        {
            throw new NotFoundException("Question", questionId);
        }

        question.IsDeleted = false;
        question.UpdatedAt = DateTime.UtcNow;
    }

    private async Task UnhideComment(Guid commentId, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

        if (comment == null)
        {
            throw new NotFoundException("Comment", commentId);
        }

        comment.IsDeleted = false;
        comment.UpdatedAt = DateTime.UtcNow;
    }
}
