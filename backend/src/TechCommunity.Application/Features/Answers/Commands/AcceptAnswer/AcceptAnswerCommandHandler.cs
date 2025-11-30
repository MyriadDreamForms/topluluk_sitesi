using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Answers.Commands.AcceptAnswer;

public class AcceptAnswerCommandHandler : IRequestHandler<AcceptAnswerCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AcceptAnswerCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(AcceptAnswerCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        var answer = await _context.Answers
            .Include(a => a.Question)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(a => a.Id == request.AnswerId, cancellationToken)
            ?? throw new NotFoundException("Cevap", request.AnswerId);

        var question = answer.Question;

        // Only question author can accept answers
        if (question.AuthorId != userId)
        {
            throw new ForbiddenException("Sadece soru sahibi cevabı kabul edebilir.");
        }

        // Unaccept previously accepted answer
        var previouslyAccepted = question.Answers.FirstOrDefault(a => a.IsAccepted);
        if (previouslyAccepted != null && previouslyAccepted.Id != request.AnswerId)
        {
            previouslyAccepted.IsAccepted = false;
        }

        // Toggle acceptance (if clicking on already accepted, unaccept it)
        if (answer.IsAccepted)
        {
            answer.IsAccepted = false;
            question.AcceptedAnswerId = null;
        }
        else
        {
            answer.IsAccepted = true;
            question.AcceptedAnswerId = answer.Id;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
