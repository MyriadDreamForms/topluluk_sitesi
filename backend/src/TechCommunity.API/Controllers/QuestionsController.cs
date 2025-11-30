using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Questions.Commands.CreateQuestion;
using TechCommunity.Application.Features.Questions.Commands.DeleteQuestion;
using TechCommunity.Application.Features.Questions.Commands.UpdateQuestion;
using TechCommunity.Application.Features.Questions.Queries.GetQuestionById;
using TechCommunity.Application.Features.Questions.Queries.GetQuestions;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class QuestionsController : BaseApiController
{
    /// <summary>
    /// Soruları listeler (sayfalı, filtreleme ve sıralama destekli)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetQuestions([FromQuery] GetQuestionsQuery query)
    {
        var result = await Mediator.Send(query);
        return SuccessPaginated(result);
    }

    /// <summary>
    /// Slug'a göre soru detayını getirir
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetQuestion(string slug)
    {
        var result = await Mediator.Send(new GetQuestionBySlugQuery(slug));
        return Success(result);
    }

    /// <summary>
    /// Yeni soru oluşturur
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionCommand command)
    {
        var questionId = await Mediator.Send(command);
        return Success(new { id = questionId }, "Soru başarıyla oluşturuldu.");
    }

    /// <summary>
    /// Mevcut soruyu günceller
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] UpdateQuestionCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID uyuşmazlığı." });
        }

        await Mediator.Send(command);
        return Success("Soru başarıyla güncellendi.");
    }

    /// <summary>
    /// Soruyu siler (soft delete)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteQuestion(Guid id)
    {
        await Mediator.Send(new DeleteQuestionCommand(id));
        return Success("Soru başarıyla silindi.");
    }
}
