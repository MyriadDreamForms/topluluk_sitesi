using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Tags.DTOs;

namespace TechCommunity.Application.Features.Tags.Queries.GetTagContent;

public record GetTagContentQuery : IRequest<TagContentDto>
{
    public string Slug { get; init; } = string.Empty;
    public string ContentType { get; init; } = "all"; // "all", "posts", "questions"
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public record TagContentDto
{
    public TagDto Tag { get; init; } = null!;
    public PaginatedList<TagContentItemDto> Items { get; init; } = null!;
}

public record TagContentItemDto
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty; // "post" or "question"
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public AuthorDto Author { get; init; } = null!;
    public DateTime CreatedAt { get; init; }
    public int ViewCount { get; init; }
    public int CommentCount { get; init; }
    public int AnswerCount { get; init; }
    public bool HasAcceptedAnswer { get; init; }
}

public record AuthorDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}
