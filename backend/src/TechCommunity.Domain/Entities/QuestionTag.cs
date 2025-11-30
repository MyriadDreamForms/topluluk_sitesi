namespace TechCommunity.Domain.Entities;

public class QuestionTag
{
    public Guid QuestionId { get; set; }
    public Guid TagId { get; set; }

    // Navigation properties
    public virtual Question Question { get; set; } = null!;
    public virtual Tag Tag { get; set; } = null!;
}
