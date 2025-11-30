using MediatR;

namespace TechCommunity.Application.Features.Admin.Commands.HideContent;

public record HideContentCommand : IRequest<Unit>
{
    public string ContentType { get; init; } = string.Empty; // "Post", "Question", "Answer", "Comment"
    public Guid ContentId { get; init; }
    public string? Reason { get; init; }
}
