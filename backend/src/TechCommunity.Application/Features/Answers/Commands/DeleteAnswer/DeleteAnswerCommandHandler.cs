using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Answers.Commands.DeleteAnswer;

public class DeleteAnswerCommandHandler : IRequestHandler<DeleteAnswerCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteAnswerCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(DeleteAnswerCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        var answer = await _context.Answers
            .Include(a => a.Question)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Cevap", request.Id);

        if (answer.AuthorId != userId)
        {
            throw new ForbiddenException("Bu cevabı silme yetkiniz yok.");
        }

        // If this was the accepted answer, remove the acceptance
        if (answer.IsAccepted)
        {
            answer.Question.AcceptedAnswerId = null;
        }

        // Decrement question's answer count
        answer.Question.AnswerCount = Math.Max(0, answer.Question.AnswerCount - 1);

        _context.Answers.Remove(answer);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
