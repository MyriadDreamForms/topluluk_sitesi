using MediatR;
using TechCommunity.Application.Features.Auth.Commands.Register;

namespace TechCommunity.Application.Features.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(
    string RefreshToken
) : IRequest<AuthResult>;
