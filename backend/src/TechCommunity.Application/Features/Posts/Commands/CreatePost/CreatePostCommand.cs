using MediatR;
using TechCommunity.Application.Features.Posts.DTOs;

namespace TechCommunity.Application.Features.Posts.Commands.CreatePost;

public record CreatePostCommand : IRequest<PostDetailDto>
{
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? CoverImageUrl { get; init; }
    public bool IsPublished { get; init; } = true;
    public IReadOnlyList<string> Tags { get; init; } = [];
}
