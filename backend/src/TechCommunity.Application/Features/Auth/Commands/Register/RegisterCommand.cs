using MediatR;

namespace TechCommunity.Application.Features.Auth.Commands.Register;

public record RegisterCommand(
    string Email,
    string Username,
    string DisplayName,
    string Password,
    string ConfirmPassword
) : IRequest<AuthResult>;

public record AuthResult
{
    public required UserDto User { get; init; }
    public required TokensDto Tokens { get; init; }
}

public record UserDto
{
    public Guid Id { get; init; }
    public required string Email { get; init; }
    public required string Username { get; init; }
    public string? DisplayName { get; init; }
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public required string Role { get; init; }
}

public record TokensDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public int ExpiresIn { get; init; }
}
