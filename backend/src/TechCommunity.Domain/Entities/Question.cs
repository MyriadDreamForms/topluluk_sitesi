using TechCommunity.Domain.Common;
using NpgsqlTypes;

namespace TechCommunity.Domain.Entities;

public class Question : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? BodyHtml { get; set; }
    public Guid AuthorId { get; set; }
    public Guid? AcceptedAnswerId { get; set; }
    public int ViewCount { get; set; }
    public int AnswerCount { get; set; }
    public bool IsDeleted { get; set; }
    public NpgsqlTsVector? SearchVector { get; set; }

    // Navigation properties
    public virtual User Author { get; set; } = null!;
    public virtual Answer? AcceptedAnswer { get; set; }
    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public virtual ICollection<QuestionTag> QuestionTags { get; set; } = new List<QuestionTag>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
