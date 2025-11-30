using MediatR;

namespace TechCommunity.Application.Features.Admin.Commands.UnhideContent;

public record UnhideContentCommand : IRequest<Unit>
{
    public string ContentType { get; init; } = string.Empty; // "Post", "Question", "Answer", "Comment"
    public Guid ContentId { get; init; }
}
