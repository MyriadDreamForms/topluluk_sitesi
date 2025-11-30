using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Tags.DTOs;

namespace TechCommunity.Application.Features.Tags.Queries.GetTagContent;

public class GetTagContentQueryHandler : IRequestHandler<GetTagContentQuery, TagContentDto>
{
    private readonly IApplicationDbContext _context;

    public GetTagContentQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TagContentDto> Handle(GetTagContentQuery request, CancellationToken cancellationToken)
    {
        var tag = await _context.Tags
            .AsNoTracking()
            .Where(t => t.Slug == request.Slug)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                Description = t.Description,
                PostCount = t.PostTags.Count,
                QuestionCount = t.QuestionTags.Count
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (tag == null)
        {
            throw new NotFoundException("Tag", request.Slug);
        }

        var items = new List<TagContentItemDto>();
        int totalCount = 0;

        if (request.ContentType == "all" || request.ContentType == "posts")
        {
            var posts = await _context.Posts
                .AsNoTracking()
                .Where(p => !p.IsDeleted && p.PostTags.Any(pt => pt.Tag.Slug == request.Slug))
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new TagContentItemDto
                {
                    Id = p.Id,
                    Type = "post",
                    Title = p.Title,
                    Slug = p.Slug,
                    Excerpt = p.Content.Length > 200 ? p.Content.Substring(0, 200) + "..." : p.Content,
                    Author = new AuthorDto
                    {
                        Id = p.Author.Id,
                        Username = p.Author.Username,
                        DisplayName = p.Author.DisplayName,
                        AvatarUrl = p.Author.AvatarUrl
                    },
                    CreatedAt = p.CreatedAt,
                    ViewCount = p.ViewCount,
                    CommentCount = p.Comments.Count(c => !c.IsDeleted),
                    AnswerCount = 0,
                    HasAcceptedAnswer = false
                })
                .ToListAsync(cancellationToken);

            items.AddRange(posts);
        }

        if (request.ContentType == "all" || request.ContentType == "questions")
        {
            var questions = await _context.Questions
                .AsNoTracking()
                .Where(q => !q.IsDeleted && q.QuestionTags.Any(qt => qt.Tag.Slug == request.Slug))
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new TagContentItemDto
                {
                    Id = q.Id,
                    Type = "question",
                    Title = q.Title,
                    Slug = q.Slug,
                    Excerpt = q.Body.Length > 200 ? q.Body.Substring(0, 200) + "..." : q.Body,
                    Author = new AuthorDto
                    {
                        Id = q.Author.Id,
                        Username = q.Author.Username,
                        DisplayName = q.Author.DisplayName,
                        AvatarUrl = q.Author.AvatarUrl
                    },
                    CreatedAt = q.CreatedAt,
                    ViewCount = q.ViewCount,
                    CommentCount = 0,
                    AnswerCount = q.AnswerCount,
                    HasAcceptedAnswer = q.AcceptedAnswerId.HasValue
                })
                .ToListAsync(cancellationToken);

            items.AddRange(questions);
        }

        // Sort combined results by date
        items = items.OrderByDescending(i => i.CreatedAt).ToList();
        totalCount = items.Count;

        // Apply pagination
        var pagedItems = items
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        return new TagContentDto
        {
            Tag = tag,
            Items = new PaginatedList<TagContentItemDto>(
                pagedItems,
                totalCount,
                request.PageNumber,
                request.PageSize
            )
        };
    }
}
