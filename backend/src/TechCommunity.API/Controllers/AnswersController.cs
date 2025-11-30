using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Answers.Commands.AcceptAnswer;
using TechCommunity.Application.Features.Answers.Commands.AddAnswer;
using TechCommunity.Application.Features.Answers.Commands.DeleteAnswer;
using TechCommunity.Application.Features.Answers.Commands.UpdateAnswer;
using TechCommunity.Application.Features.Answers.Queries.GetAnswers;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class AnswersController : BaseApiController
{
    /// <summary>
    /// Soru için cevapları getirir
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAnswers([FromQuery] GetAnswersQuery query)
    {
        var result = await Mediator.Send(query);
        return SuccessPaginated(result);
    }

    /// <summary>
    /// Yeni cevap ekler
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddAnswer([FromBody] AddAnswerCommand command)
    {
        var answerId = await Mediator.Send(command);
        return Success(new { id = answerId }, "Cevap başarıyla eklendi.");
    }

    /// <summary>
    /// Cevabı günceller
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateAnswer(Guid id, [FromBody] UpdateAnswerCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID uyuşmazlığı." });
        }

        await Mediator.Send(command);
        return Success("Cevap başarıyla güncellendi.");
    }

    /// <summary>
    /// Cevabı siler
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAnswer(Guid id)
    {
        await Mediator.Send(new DeleteAnswerCommand(id));
        return Success("Cevap başarıyla silindi.");
    }

    /// <summary>
    /// Cevabı kabul eder veya kabul edilmişse kaldırır (toggle)
    /// </summary>
    [HttpPost("{id:guid}/accept")]
    [Authorize]
    public async Task<IActionResult> AcceptAnswer(Guid id)
    {
        await Mediator.Send(new AcceptAnswerCommand(id));
        return Success("Cevap durumu güncellendi.");
    }
}
