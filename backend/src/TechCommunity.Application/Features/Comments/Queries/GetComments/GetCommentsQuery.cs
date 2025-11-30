using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Comments.DTOs;

namespace TechCommunity.Application.Features.Comments.Queries.GetComments;

public record GetCommentsQuery : IRequest<PaginatedList<CommentDto>>
{
    public Guid? PostId { get; init; }
    public Guid? QuestionId { get; init; }
    public Guid? ParentId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
