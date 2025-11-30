using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Questions.Commands.DeleteQuestion;

public class DeleteQuestionCommandHandler : IRequestHandler<DeleteQuestionCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteQuestionCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        var question = await _context.Questions
            .Include(q => q.QuestionTags)
            .ThenInclude(qt => qt.Tag)
            .FirstOrDefaultAsync(q => q.Id == request.Id && !q.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Soru", request.Id);

        if (question.AuthorId != userId)
        {
            throw new ForbiddenException("Bu soruyu silme yetkiniz yok.");
        }

        // Soft delete
        question.IsDeleted = true;
        question.UpdatedAt = DateTime.UtcNow;

        // Decrement tag question counts
        foreach (var questionTag in question.QuestionTags)
        {
            questionTag.Tag.QuestionCount = Math.Max(0, questionTag.Tag.QuestionCount - 1);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
