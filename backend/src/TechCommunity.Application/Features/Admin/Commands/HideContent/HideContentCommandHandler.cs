using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Admin.Commands.HideContent;

public class HideContentCommandHandler : IRequestHandler<HideContentCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public HideContentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(HideContentCommand request, CancellationToken cancellationToken)
    {
        switch (request.ContentType.ToLower())
        {
            case "post":
                await HidePost(request.ContentId, cancellationToken);
                break;
            case "question":
                await HideQuestion(request.ContentId, cancellationToken);
                break;
            case "answer":
                await HideAnswer(request.ContentId, cancellationToken);
                break;
            case "comment":
                await HideComment(request.ContentId, cancellationToken);
                break;
            default:
                throw new ValidationException("ContentType", $"Invalid content type: {request.ContentType}. Valid types are: Post, Question, Answer, Comment");
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    private async Task HidePost(Guid postId, CancellationToken cancellationToken)
    {
        var post = await _context.Posts
            .FirstOrDefaultAsync(p => p.Id == postId, cancellationToken);

        if (post == null)
        {
            throw new NotFoundException("Post", postId);
        }

        post.IsPublished = false;
        post.UpdatedAt = DateTime.UtcNow;
    }

    private async Task HideQuestion(Guid questionId, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == questionId, cancellationToken);

        if (question == null)
        {
            throw new NotFoundException("Question", questionId);
        }

        question.IsDeleted = true;
        question.UpdatedAt = DateTime.UtcNow;
    }

    private async Task HideAnswer(Guid answerId, CancellationToken cancellationToken)
    {
        var answer = await _context.Answers
            .FirstOrDefaultAsync(a => a.Id == answerId, cancellationToken);

        if (answer == null)
        {
            throw new NotFoundException("Answer", answerId);
        }

        // Mark as soft deleted using UpdatedAt (we don't have IsDeleted on Answer)
        // For now we just track that it's hidden via the system
        answer.UpdatedAt = DateTime.UtcNow;
        // Note: Answer doesn't have IsDeleted field, so we remove it from the DB
        _context.Answers.Remove(answer);
    }

    private async Task HideComment(Guid commentId, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

        if (comment == null)
        {
            throw new NotFoundException("Comment", commentId);
        }

        comment.IsDeleted = true;
        comment.UpdatedAt = DateTime.UtcNow;
    }
}
