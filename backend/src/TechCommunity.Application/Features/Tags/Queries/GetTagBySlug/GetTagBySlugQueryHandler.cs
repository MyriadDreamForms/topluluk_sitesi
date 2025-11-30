using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Tags.DTOs;

namespace TechCommunity.Application.Features.Tags.Queries.GetTagBySlug;

public class GetTagBySlugQueryHandler : IRequestHandler<GetTagBySlugQuery, TagDto>
{
    private readonly IApplicationDbContext _context;

    public GetTagBySlugQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TagDto> Handle(GetTagBySlugQuery request, CancellationToken cancellationToken)
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

        return tag;
    }
}
