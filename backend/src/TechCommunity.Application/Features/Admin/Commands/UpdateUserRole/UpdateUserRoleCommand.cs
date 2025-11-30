using MediatR;

namespace TechCommunity.Application.Features.Admin.Commands.UpdateUserRole;

public record UpdateUserRoleCommand : IRequest<Unit>
{
    public Guid UserId { get; init; }
    public string Role { get; init; } = string.Empty;
}
