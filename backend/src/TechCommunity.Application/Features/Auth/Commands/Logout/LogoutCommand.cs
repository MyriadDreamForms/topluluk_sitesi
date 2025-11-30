using MediatR;

namespace TechCommunity.Application.Features.Auth.Commands.Logout;

public record LogoutCommand(
    string RefreshToken
) : IRequest<Unit>;
