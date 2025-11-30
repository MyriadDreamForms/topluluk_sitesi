using MediatR;

namespace TechCommunity.Application.Features.Admin.Commands.UnbanUser;

public record UnbanUserCommand : IRequest<Unit>
{
    public Guid UserId { get; init; }
}
