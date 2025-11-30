using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("Tags");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(t => t.Slug)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(t => t.Description)
            .HasMaxLength(500);

        builder.HasIndex(t => t.Name)
            .IsUnique()
            .HasDatabaseName("IX_Tag_Name");

        builder.HasIndex(t => t.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Tag_Slug");

        builder.HasIndex(t => t.PostCount)
            .IsDescending()
            .HasDatabaseName("IX_Tag_PostCount");

        builder.HasIndex(t => t.QuestionCount)
            .IsDescending()
            .HasDatabaseName("IX_Tag_QuestionCount");
    }
}
