using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class QuestionTagConfiguration : IEntityTypeConfiguration<QuestionTag>
{
    public void Configure(EntityTypeBuilder<QuestionTag> builder)
    {
        builder.ToTable("QuestionTags");

        builder.HasKey(qt => new { qt.QuestionId, qt.TagId });

        builder.HasOne(qt => qt.Question)
            .WithMany(q => q.QuestionTags)
            .HasForeignKey(qt => qt.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(qt => qt.Tag)
            .WithMany(t => t.QuestionTags)
            .HasForeignKey(qt => qt.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(qt => qt.TagId)
            .HasDatabaseName("IX_QuestionTag_TagId");
    }
}
