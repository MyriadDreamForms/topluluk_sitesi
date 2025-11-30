using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Admin.DTOs;

namespace TechCommunity.Application.Features.Admin.Queries.GetUsers;

public record GetUsersQuery : IRequest<PaginatedList<AdminUserDto>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? SearchTerm { get; init; }
    public string? Role { get; init; }
    public bool? IsBanned { get; init; }
    public string SortBy { get; init; } = "createdAt";
    public bool SortDescending { get; init; } = true;
}
