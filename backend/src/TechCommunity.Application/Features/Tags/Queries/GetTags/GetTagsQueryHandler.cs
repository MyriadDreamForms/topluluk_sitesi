using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Tags.DTOs;

namespace TechCommunity.Application.Features.Tags.Queries.GetTags;

public class GetTagsQueryHandler : IRequestHandler<GetTagsQuery, List<TagDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetTagsQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<List<TagDto>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"tags:{request.Search ?? "all"}:{request.Limit ?? 0}:{request.Popular}";
        
        var cached = await _cacheService.GetAsync<List<TagDto>>(cacheKey, cancellationToken);
        if (cached != null)
        {
            return cached;
        }

        var query = _context.Tags.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(t => t.Name.ToLower().Contains(searchLower) || 
                                     t.Slug.ToLower().Contains(searchLower));
        }

        IQueryable<TagDto> tagDtoQuery;

        if (request.Popular)
        {
            tagDtoQuery = query
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Slug = t.Slug,
                    Description = t.Description,
                    PostCount = t.PostTags.Count,
                    QuestionCount = t.QuestionTags.Count
                })
                .OrderByDescending(t => t.PostCount + t.QuestionCount);
        }
        else
        {
            tagDtoQuery = query
                .OrderBy(t => t.Name)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Slug = t.Slug,
                    Description = t.Description,
                    PostCount = t.PostTags.Count,
                    QuestionCount = t.QuestionTags.Count
                });
        }

        if (request.Limit.HasValue && request.Limit.Value > 0)
        {
            tagDtoQuery = tagDtoQuery.Take(request.Limit.Value);
        }

        var result = await tagDtoQuery.ToListAsync(cancellationToken);

        // Cache for 5 minutes
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
