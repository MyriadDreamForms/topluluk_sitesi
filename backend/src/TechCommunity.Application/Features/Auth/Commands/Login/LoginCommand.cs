using MediatR;
using TechCommunity.Application.Features.Auth.Commands.Register;

namespace TechCommunity.Application.Features.Auth.Commands.Login;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResult>;
