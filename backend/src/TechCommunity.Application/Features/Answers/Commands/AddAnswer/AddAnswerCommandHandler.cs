using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Features.Answers.Commands.AddAnswer;

public class AddAnswerCommandHandler : IRequestHandler<AddAnswerCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IMarkdownService _markdownService;

    public AddAnswerCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IMarkdownService markdownService)
    {
        _context = context;
        _currentUser = currentUser;
        _markdownService = markdownService;
    }

    public async Task<Guid> Handle(AddAnswerCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        // Verify question exists
        var question = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Soru", request.QuestionId);

        // Convert markdown to HTML
        var bodyHtml = _markdownService.ToHtml(request.Body);

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            Body = request.Body,
            BodyHtml = bodyHtml,
            QuestionId = request.QuestionId,
            AuthorId = userId,
            IsAccepted = false,
            CreatedAt = DateTime.UtcNow
        };

        // Increment question's answer count
        question.AnswerCount++;

        _context.Answers.Add(answer);
        await _context.SaveChangesAsync(cancellationToken);

        return answer.Id;
    }
}
