using TechCommunity.Domain.Common;
using NpgsqlTypes;

namespace TechCommunity.Domain.Entities;

public class Post : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ContentHtml { get; set; }
    public string? Excerpt { get; set; }
    public string? CoverImageUrl { get; set; }
    public Guid AuthorId { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? PublishedAt { get; set; }
    public NpgsqlTsVector? SearchVector { get; set; }

    // Navigation properties
    public virtual User Author { get; set; } = null!;
    public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
