using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.ToTable("Comments");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Content)
            .IsRequired()
            .HasMaxLength(2000);

        builder.HasOne(c => c.Author)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Question)
            .WithMany(q => q.Comments)
            .HasForeignKey(c => c.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Answer)
            .WithMany(a => a.Comments)
            .HasForeignKey(c => c.AnswerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Parent)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => c.PostId)
            .HasDatabaseName("IX_Comment_PostId");

        builder.HasIndex(c => c.QuestionId)
            .HasDatabaseName("IX_Comment_QuestionId");

        builder.HasIndex(c => c.AnswerId)
            .HasDatabaseName("IX_Comment_AnswerId");

        builder.HasIndex(c => c.AuthorId)
            .HasDatabaseName("IX_Comment_AuthorId");

        builder.HasIndex(c => c.ParentId)
            .HasDatabaseName("IX_Comment_ParentId");

        builder.HasIndex(c => c.CreatedAt)
            .HasDatabaseName("IX_Comment_CreatedAt");

        builder.HasIndex(c => c.IsDeleted)
            .HasDatabaseName("IX_Comment_IsDeleted");

        // Check constraint: Comment must belong to Post, Question, or Answer
        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Comment_Target",
            @"(""PostId"" IS NOT NULL AND ""QuestionId"" IS NULL AND ""AnswerId"" IS NULL) OR 
              (""PostId"" IS NULL AND ""QuestionId"" IS NOT NULL AND ""AnswerId"" IS NULL) OR 
              (""PostId"" IS NULL AND ""QuestionId"" IS NULL AND ""AnswerId"" IS NOT NULL)"));
    }
}
