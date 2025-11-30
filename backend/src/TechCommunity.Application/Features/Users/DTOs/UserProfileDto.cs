namespace TechCommunity.Application.Features.Users.DTOs;

public record UserProfileDto
{
    public Guid Id { get; init; }
    public string? Email { get; init; }
    public required string Username { get; init; }
    public string? DisplayName { get; init; }
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public string? GitHubUrl { get; init; }
    public string? TwitterUrl { get; init; }
    public string? LinkedInUrl { get; init; }
    public string? WebsiteUrl { get; init; }
    public required string Role { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? LastLoginAt { get; init; }
}
