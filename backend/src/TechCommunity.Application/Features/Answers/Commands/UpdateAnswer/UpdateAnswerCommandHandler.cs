using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Answers.Commands.UpdateAnswer;

public class UpdateAnswerCommandHandler : IRequestHandler<UpdateAnswerCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IMarkdownService _markdownService;

    public UpdateAnswerCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IMarkdownService markdownService)
    {
        _context = context;
        _currentUser = currentUser;
        _markdownService = markdownService;
    }

    public async Task<Unit> Handle(UpdateAnswerCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        var answer = await _context.Answers
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Cevap", request.Id);

        if (answer.AuthorId != userId)
        {
            throw new ForbiddenException("Bu cevabı düzenleme yetkiniz yok.");
        }

        answer.Body = request.Body;
        answer.BodyHtml = _markdownService.ToHtml(request.Body);
        answer.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
