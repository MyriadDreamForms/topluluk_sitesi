namespace TechCommunity.Application.Features.Users.DTOs;

public record UserSummaryDto
{
    public Guid Id { get; init; }
    public required string Username { get; init; }
    public string? DisplayName { get; init; }
    public string? AvatarUrl { get; init; }
    public required string Role { get; init; }
}
