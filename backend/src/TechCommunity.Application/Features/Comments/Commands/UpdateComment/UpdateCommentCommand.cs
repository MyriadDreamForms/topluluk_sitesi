using MediatR;
using TechCommunity.Application.Features.Comments.DTOs;

namespace TechCommunity.Application.Features.Comments.Commands.UpdateComment;

public record UpdateCommentCommand : IRequest<CommentDto>
{
    public Guid Id { get; init; }
    public string Content { get; init; } = string.Empty;
}
