namespace TechCommunity.Application.Features.Admin.DTOs;

public record AdminUserDto(
    Guid Id,
    string Username,
    string Email,
    string? DisplayName,
    string? AvatarUrl,
    string Role,
    bool IsActive,
    bool IsBanned,
    DateTime? BannedUntil,
    string? BanReason,
    int PostCount,
    int QuestionCount,
    int AnswerCount,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);
