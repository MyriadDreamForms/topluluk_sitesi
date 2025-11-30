using MediatR;

namespace TechCommunity.Application.Features.Admin.Commands.BanUser;

public record BanUserCommand : IRequest<Unit>
{
    public Guid UserId { get; init; }
    public string? Reason { get; init; }
}
