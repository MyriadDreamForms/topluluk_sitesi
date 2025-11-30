using MediatR;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Posts.Commands.UpdatePost;

public record UpdatePostCommand : IRequest<PostDetailDto>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? CoverImageUrl { get; init; }
    public bool IsPublished { get; init; }
    public IReadOnlyList<string> Tags { get; init; } = [];
}
