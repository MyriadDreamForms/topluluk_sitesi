using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Features.Questions.Commands.UpdateQuestion;

public class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly ISlugService _slugService;
    private readonly IMarkdownService _markdownService;

    public UpdateQuestionCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        ISlugService slugService,
        IMarkdownService markdownService)
    {
        _context = context;
        _currentUser = currentUser;
        _slugService = slugService;
        _markdownService = markdownService;
    }

    public async Task<Unit> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        var question = await _context.Questions
            .Include(q => q.QuestionTags)
            .ThenInclude(qt => qt.Tag)
            .FirstOrDefaultAsync(q => q.Id == request.Id && !q.IsDeleted, cancellationToken)
            ?? throw new NotFoundException("Soru", request.Id);

        if (question.AuthorId != userId)
        {
            throw new ForbiddenException("Bu soruyu düzenleme yetkiniz yok.");
        }

        // Update fields
        question.Title = request.Title;
        question.Body = request.Body;
        question.BodyHtml = _markdownService.ToHtml(request.Body);
        question.UpdatedAt = DateTime.UtcNow;

        // Update slug if title changed
        var newBaseSlug = _slugService.GenerateSlug(request.Title);
        if (newBaseSlug != question.Slug.Split('-')[0])
        {
            question.Slug = await EnsureUniqueSlugAsync(newBaseSlug, question.Id, cancellationToken);
        }

        // Handle tag updates
        await UpdateTagsAsync(question, request.TagNames, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }

    private async Task UpdateTagsAsync(Question question, List<string> tagNames, CancellationToken cancellationToken)
    {
        // Decrement question count for removed tags
        foreach (var questionTag in question.QuestionTags.ToList())
        {
            questionTag.Tag.QuestionCount = Math.Max(0, questionTag.Tag.QuestionCount - 1);
        }

        // Clear existing tags
        question.QuestionTags.Clear();

        if (tagNames.Count == 0) return;

        var normalizedTagNames = tagNames
            .Select(t => t.Trim().ToLowerInvariant())
            .Distinct()
            .ToList();

        var existingTags = await _context.Tags
            .Where(t => normalizedTagNames.Contains(t.Name.ToLower()))
            .ToListAsync(cancellationToken);

        var existingTagNames = existingTags.Select(t => t.Name.ToLower()).ToHashSet();

        foreach (var tagName in normalizedTagNames)
        {
            Tag tag;

            if (existingTagNames.Contains(tagName))
            {
                tag = existingTags.First(t => t.Name.ToLower() == tagName);
                tag.QuestionCount++;
            }
            else
            {
                tag = new Tag
                {
                    Id = Guid.NewGuid(),
                    Name = tagName,
                    Slug = _slugService.GenerateSlug(tagName),
                    QuestionCount = 1,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Tags.Add(tag);
            }

            question.QuestionTags.Add(new QuestionTag
            {
                QuestionId = question.Id,
                TagId = tag.Id
            });
        }
    }

    private async Task<string> EnsureUniqueSlugAsync(string baseSlug, Guid excludeId, CancellationToken cancellationToken)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _context.Questions.AnyAsync(q => q.Slug == slug && q.Id != excludeId, cancellationToken))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }
}
