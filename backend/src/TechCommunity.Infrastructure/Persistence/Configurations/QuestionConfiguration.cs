using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("Questions");

        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(q => q.Slug)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(q => q.Body)
            .IsRequired()
            .HasMaxLength(30000);

        builder.Property(q => q.HiddenReason)
            .HasMaxLength(500);

        builder.Property(q => q.SearchVector)
            .HasColumnType("tsvector");

        builder.HasOne(q => q.Author)
            .WithMany(u => u.Questions)
            .HasForeignKey(q => q.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(q => q.AcceptedAnswer)
            .WithOne()
            .HasForeignKey<Question>(q => q.AcceptedAnswerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(q => q.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Question_Slug");

        builder.HasIndex(q => q.AuthorId)
            .HasDatabaseName("IX_Question_AuthorId");

        builder.HasIndex(q => q.CreatedAt)
            .IsDescending()
            .HasDatabaseName("IX_Question_CreatedAt");

        builder.HasIndex(q => q.AnswerCount)
            .IsDescending()
            .HasDatabaseName("IX_Question_AnswerCount");

        builder.HasIndex(q => q.SearchVector)
            .HasMethod("GIN")
            .HasDatabaseName("IX_Question_SearchVector");

        builder.HasIndex(q => q.AcceptedAnswerId)
            .HasDatabaseName("IX_Question_AcceptedAnswerId");
    }
}
