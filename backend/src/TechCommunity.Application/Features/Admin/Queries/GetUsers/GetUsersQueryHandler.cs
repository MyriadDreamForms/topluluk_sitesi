using MediatR;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Admin.DTOs;

namespace TechCommunity.Application.Features.Admin.Queries.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedList<AdminUserDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<AdminUserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsNoTracking();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(u => 
                u.Username.ToLower().Contains(searchTerm) ||
                u.Email.ToLower().Contains(searchTerm) ||
                (u.DisplayName != null && u.DisplayName.ToLower().Contains(searchTerm)));
        }

        // Apply role filter
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            if (Enum.TryParse<Domain.Enums.UserRole>(request.Role, true, out var role))
            {
                query = query.Where(u => u.Role == role);
            }
        }

        // Apply banned filter
        if (request.IsBanned.HasValue)
        {
            query = query.Where(u => u.IsBanned == request.IsBanned.Value);
        }

        // Apply sorting
        query = request.SortBy.ToLower() switch
        {
            "username" => request.SortDescending 
                ? query.OrderByDescending(u => u.Username) 
                : query.OrderBy(u => u.Username),
            "email" => request.SortDescending 
                ? query.OrderByDescending(u => u.Email) 
                : query.OrderBy(u => u.Email),
            "lastloginat" => request.SortDescending 
                ? query.OrderByDescending(u => u.LastLoginAt) 
                : query.OrderBy(u => u.LastLoginAt),
            _ => request.SortDescending 
                ? query.OrderByDescending(u => u.CreatedAt) 
                : query.OrderBy(u => u.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(u => new AdminUserDto(
                u.Id,
                u.Username,
                u.Email,
                u.DisplayName,
                u.AvatarUrl,
                u.Role.ToString(),
                !u.IsBanned,
                u.IsBanned,
                null, // BannedUntil - not in our model
                u.BanReason,
                u.Posts.Count,
                u.Questions.Count,
                u.Answers.Count,
                u.CreatedAt,
                u.LastLoginAt))
            .ToListAsync(cancellationToken);

        return new PaginatedList<AdminUserDto>(
            users,
            totalCount,
            request.Page,
            request.PageSize);
    }
}
