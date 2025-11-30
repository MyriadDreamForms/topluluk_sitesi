using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Questions.DTOs;

namespace TechCommunity.Application.Features.Questions.Queries.GetQuestions;

public record GetQuestionsQuery : IRequest<PaginatedList<QuestionDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? Search { get; init; }
    public string? Tag { get; init; }
    public string? AuthorUsername { get; init; }
    public string SortBy { get; init; } = "latest"; // latest, popular, unanswered, oldest
    public bool? HasAcceptedAnswer { get; init; }
}
