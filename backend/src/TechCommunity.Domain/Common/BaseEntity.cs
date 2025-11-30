namespace TechCommunity.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public abstract class BaseAuditableEntity : BaseEntity
{
    public bool IsHidden { get; set; }
    public string? HiddenReason { get; set; }
}
