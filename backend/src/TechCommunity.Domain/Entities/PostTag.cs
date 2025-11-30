namespace TechCommunity.Domain.Entities;

public class PostTag
{
    public Guid PostId { get; set; }
    public Guid TagId { get; set; }

    // Navigation properties
    public virtual Post Post { get; set; } = null!;
    public virtual Tag Tag { get; set; } = null!;
}
