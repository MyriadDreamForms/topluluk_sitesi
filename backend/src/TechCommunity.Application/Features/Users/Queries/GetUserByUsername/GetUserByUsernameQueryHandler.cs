using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserByUsername;

public class GetUserByUsernameQueryHandler : IRequestHandler<GetUserByUsernameQuery, PublicUserProfileDto>
{
    private readonly IApplicationDbContext _context;

    public GetUserByUsernameQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PublicUserProfileDto> Handle(GetUserByUsernameQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Where(u => u.Username.ToLower() == request.Username.ToLower() && !u.IsBanned)
            .Select(u => new PublicUserProfileDto(
                u.Id,
                u.Username,
                u.DisplayName,
                u.Bio,
                u.AvatarUrl,
                u.GitHubUrl,
                u.TwitterUrl,
                u.LinkedInUrl,
                u.WebsiteUrl,
                u.Role.ToString(),
                u.CreatedAt,
                u.Posts.Count(p => p.IsPublished),
                u.Questions.Count(q => !q.IsDeleted),
                u.Answers.Count()
            ))
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            throw new NotFoundException("User", request.Username);
        }

        return user;
    }
}
