using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Services;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly ISlugService _slugService;
    private readonly IMarkdownService _markdownService;
    private readonly ICacheInvalidationService _cacheInvalidationService;

    public CreateQuestionCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        ISlugService slugService,
        IMarkdownService markdownService,
        ICacheInvalidationService cacheInvalidationService)
    {
        _context = context;
        _currentUser = currentUser;
        _slugService = slugService;
        _markdownService = markdownService;
        _cacheInvalidationService = cacheInvalidationService;
    }

    public async Task<Guid> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedException("Giriş yapmanız gerekiyor.");

        // Generate slug
        var baseSlug = _slugService.GenerateSlug(request.Title);
        var slug = await EnsureUniqueSlugAsync(baseSlug, cancellationToken);

        // Convert markdown to HTML
        var bodyHtml = _markdownService.ToHtml(request.Body);

        var question = new Question
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Slug = slug,
            Body = request.Body,
            BodyHtml = bodyHtml,
            AuthorId = userId,
            ViewCount = 0,
            AnswerCount = 0,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow
        };

        // Process tags
        if (request.TagNames.Count > 0)
        {
            var normalizedTagNames = request.TagNames
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

        _context.Questions.Add(question);
        await _context.SaveChangesAsync(cancellationToken);

        // Invalidate related caches
        await _cacheInvalidationService.InvalidateQuestionCachesAsync(cancellationToken: cancellationToken);

        return question.Id;
    }

    private async Task<string> EnsureUniqueSlugAsync(string baseSlug, CancellationToken cancellationToken)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _context.Questions.AnyAsync(q => q.Slug == slug, cancellationToken))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }
}
