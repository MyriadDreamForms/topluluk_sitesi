using TechCommunity.Domain.Common;

namespace TechCommunity.Domain.Entities;

public class Tag : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PostCount { get; set; }
    public int QuestionCount { get; set; }

    // Navigation properties
    public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    public virtual ICollection<QuestionTag> QuestionTags { get; set; } = new List<QuestionTag>();
}
