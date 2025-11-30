namespace TechCommunity.Application.Features.Admin.DTOs;

public record ContentModerationDto(
    Guid Id,
    string ContentType, // "Post", "Question", "Answer", "Comment"
    string Title,
    string? Excerpt,
    string AuthorUsername,
    string AuthorDisplayName,
    bool IsHidden,
    string? HiddenReason,
    DateTime CreatedAt,
    int ReportCount
);
