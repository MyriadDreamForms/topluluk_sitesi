using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechCommunity.Application.Features.Comments.Commands.AddComment;
using TechCommunity.Application.Features.Comments.Commands.DeleteComment;
using TechCommunity.Application.Features.Comments.Commands.UpdateComment;
using TechCommunity.Application.Features.Comments.Queries.GetComments;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class CommentsController : BaseApiController
{
    /// <summary>
    /// Get comments for a post or question
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetComments(
        [FromQuery] Guid? postId = null,
        [FromQuery] Guid? questionId = null,
        [FromQuery] Guid? parentId = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = new GetCommentsQuery
        {
            PostId = postId,
            QuestionId = questionId,
            ParentId = parentId,
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 50)
        };

        var result = await Mediator.Send(query);
        return SuccessPaginated(result);
    }

    /// <summary>
    /// Add a new comment
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddComment([FromBody] AddCommentCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result, "Yorum başarıyla eklendi.");
    }

    /// <summary>
    /// Update an existing comment
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateComment(Guid id, [FromBody] UpdateCommentCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID uyuşmazlığı." });
        }

        var result = await Mediator.Send(command);
        return Success(result, "Yorum başarıyla güncellendi.");
    }

    /// <summary>
    /// Delete a comment (soft delete)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(Guid id)
    {
        await Mediator.Send(new DeleteCommentCommand(id));
        return Success("Yorum başarıyla silindi.");
    }
}
