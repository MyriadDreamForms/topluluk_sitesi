using MediatR;
using TechCommunity.Application.Features.Questions.DTOs;

namespace TechCommunity.Application.Features.Questions.Queries.GetQuestionById;

public record GetQuestionBySlugQuery(string Slug) : IRequest<QuestionDetailDto>;
