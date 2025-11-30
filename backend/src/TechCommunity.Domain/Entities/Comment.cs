using TechCommunity.Domain.Common;

namespace TechCommunity.Domain.Entities;

public class Comment : BaseAuditableEntity
{
    public string Content { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public Guid? PostId { get; set; }
    public Guid? QuestionId { get; set; }
    public Guid? AnswerId { get; set; }
    public Guid? ParentId { get; set; }
    public bool IsDeleted { get; set; }

    // Navigation properties
    public virtual User Author { get; set; } = null!;
    public virtual Post? Post { get; set; }
    public virtual Question? Question { get; set; }
    public virtual Answer? Answer { get; set; }
    public virtual Comment? Parent { get; set; }
    public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
}
