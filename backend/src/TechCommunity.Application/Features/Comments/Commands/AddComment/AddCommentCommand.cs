using MediatR;
using TechCommunity.Application.Features.Comments.DTOs;

namespace TechCommunity.Application.Features.Comments.Commands.AddComment;

public record AddCommentCommand : IRequest<CommentDto>
{
    public Guid? PostId { get; init; }
    public Guid? QuestionId { get; init; }
    public Guid? ParentId { get; init; }
    public string Content { get; init; } = string.Empty;
}
