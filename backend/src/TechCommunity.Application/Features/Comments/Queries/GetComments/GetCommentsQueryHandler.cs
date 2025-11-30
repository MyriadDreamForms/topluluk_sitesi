using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Comments.DTOs;

namespace TechCommunity.Application.Features.Comments.Queries.GetComments;

public class GetCommentsQueryHandler : IRequestHandler<GetCommentsQuery, PaginatedList<CommentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCommentsQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedList<CommentDto>> Handle(GetCommentsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var query = _context.Comments
            .AsNoTracking()
            .Include(c => c.Author)
            .Where(c => !c.IsDeleted);

        // Filter by target
        if (request.PostId.HasValue)
        {
            query = query.Where(c => c.PostId == request.PostId.Value);
        }

        if (request.QuestionId.HasValue)
        {
            query = query.Where(c => c.QuestionId == request.QuestionId.Value);
        }

        // Filter by parent (for nested comments)
        if (request.ParentId.HasValue)
        {
            query = query.Where(c => c.ParentId == request.ParentId.Value);
        }
        else
        {
            // Get only top-level comments
            query = query.Where(c => c.ParentId == null);
        }

        // Order by creation date
        query = query.OrderByDescending(c => c.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);

        var comments = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        // Get reply counts separately
        var commentIds = comments.Select(c => c.Id).ToList();
        var replyCounts = await _context.Comments
            .Where(c => c.ParentId != null && commentIds.Contains(c.ParentId.Value) && !c.IsDeleted)
            .GroupBy(c => c.ParentId)
            .Select(g => new { ParentId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ParentId!.Value, x => x.Count, cancellationToken);

        var items = comments.Select(c => new CommentDto
        {
            Id = c.Id,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            Author = new DTOs.AuthorDto
            {
                Id = c.Author.Id,
                Username = c.Author.Username,
                DisplayName = c.Author.DisplayName,
                AvatarUrl = c.Author.AvatarUrl
            },
            ParentId = c.ParentId,
            ReplyCount = replyCounts.GetValueOrDefault(c.Id, 0),
            IsAuthor = userId.HasValue && c.AuthorId == userId.Value
        }).ToList();

        return new PaginatedList<CommentDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
