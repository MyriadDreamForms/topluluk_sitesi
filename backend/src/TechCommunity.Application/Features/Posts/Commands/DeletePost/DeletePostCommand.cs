using MediatR;

namespace TechCommunity.Application.Features.Posts.Commands.DeletePost;

public record DeletePostCommand(Guid Id) : IRequest<Unit>;
