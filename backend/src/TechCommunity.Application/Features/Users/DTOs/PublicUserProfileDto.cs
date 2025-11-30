namespace TechCommunity.Application.Features.Users.DTOs;

public record PublicUserProfileDto(
    Guid Id,
    string Username,
    string? DisplayName,
    string? Bio,
    string? AvatarUrl,
    string? GitHubUrl,
    string? TwitterUrl,
    string? LinkedInUrl,
    string? WebsiteUrl,
    string Role,
    DateTime CreatedAt,
    int PostCount,
    int QuestionCount,
    int AnswerCount
);
