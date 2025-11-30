using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class AnswerConfiguration : IEntityTypeConfiguration<Answer>
{
    public void Configure(EntityTypeBuilder<Answer> builder)
    {
        builder.ToTable("Answers");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Body)
            .IsRequired()
            .HasMaxLength(30000);

        builder.Property(a => a.HiddenReason)
            .HasMaxLength(500);

        builder.HasOne(a => a.Question)
            .WithMany(q => q.Answers)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Author)
            .WithMany(u => u.Answers)
            .HasForeignKey(a => a.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.QuestionId)
            .HasDatabaseName("IX_Answer_QuestionId");

        builder.HasIndex(a => a.AuthorId)
            .HasDatabaseName("IX_Answer_AuthorId");

        builder.HasIndex(a => a.CreatedAt)
            .HasDatabaseName("IX_Answer_CreatedAt");

        builder.HasIndex(a => new { a.QuestionId, a.IsAccepted })
            .HasDatabaseName("IX_Answer_QuestionId_IsAccepted");
    }
}
