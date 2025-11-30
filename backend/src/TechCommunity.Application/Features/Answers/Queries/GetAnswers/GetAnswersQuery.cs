using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Answers.DTOs;

namespace TechCommunity.Application.Features.Answers.Queries.GetAnswers;

public record GetAnswersQuery : IRequest<PaginatedList<AnswerDto>>
{
    public Guid QuestionId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string SortBy { get; init; } = "oldest"; // oldest, latest, accepted
}
