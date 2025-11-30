using MediatR;

namespace TechCommunity.Application.Features.Auth.Commands.ForgotPassword;

public record ForgotPasswordCommand(
    string Email
) : IRequest<Unit>;
