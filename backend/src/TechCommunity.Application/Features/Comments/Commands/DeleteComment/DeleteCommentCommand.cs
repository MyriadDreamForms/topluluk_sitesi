using MediatR;

namespace TechCommunity.Application.Features.Comments.Commands.DeleteComment;

public record DeleteCommentCommand(Guid Id) : IRequest<Unit>;
