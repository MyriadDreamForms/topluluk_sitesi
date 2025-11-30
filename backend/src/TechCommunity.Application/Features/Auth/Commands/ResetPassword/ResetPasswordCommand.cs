using MediatR;

namespace TechCommunity.Application.Features.Auth.Commands.ResetPassword;

public record ResetPasswordCommand(
    string Token,
    string Password,
    string ConfirmPassword
) : IRequest<Unit>;
