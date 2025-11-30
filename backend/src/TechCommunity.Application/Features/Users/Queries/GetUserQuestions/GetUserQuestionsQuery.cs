using MediatR;
using TechCommunity.Application.Common.Models;
using TechCommunity.Application.Features.Questions.DTOs;

namespace TechCommunity.Application.Features.Users.Queries.GetUserQuestions;

public record GetUserQuestionsQuery(string Username, int Page = 1, int PageSize = 10) : IRequest<PaginatedList<QuestionDto>>;
