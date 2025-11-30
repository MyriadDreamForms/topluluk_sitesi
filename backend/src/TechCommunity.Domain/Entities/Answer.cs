using TechCommunity.Domain.Common;

namespace TechCommunity.Domain.Entities;

public class Answer : BaseAuditableEntity
{
    public string Body { get; set; } = string.Empty;
    public string? BodyHtml { get; set; }
    public Guid QuestionId { get; set; }
    public Guid AuthorId { get; set; }
    public bool IsAccepted { get; set; }

    // Navigation properties
    public virtual Question Question { get; set; } = null!;
    public virtual User Author { get; set; } = null!;
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
