using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("Posts");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Slug)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(p => p.Content)
            .IsRequired()
            .HasMaxLength(50000);

        builder.Property(p => p.Excerpt)
            .HasMaxLength(500);

        builder.Property(p => p.CoverImageUrl)
            .HasMaxLength(500);

        builder.Property(p => p.HiddenReason)
            .HasMaxLength(500);

        builder.Property(p => p.SearchVector)
            .HasColumnType("tsvector");

        builder.HasOne(p => p.Author)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Post_Slug");

        builder.HasIndex(p => p.AuthorId)
            .HasDatabaseName("IX_Post_AuthorId");

        builder.HasIndex(p => p.CreatedAt)
            .IsDescending()
            .HasDatabaseName("IX_Post_CreatedAt");

        builder.HasIndex(p => p.ViewCount)
            .IsDescending()
            .HasDatabaseName("IX_Post_ViewCount");

        builder.HasIndex(p => p.SearchVector)
            .HasMethod("GIN")
            .HasDatabaseName("IX_Post_SearchVector");

        builder.HasIndex(p => new { p.IsPublished, p.IsHidden, p.IsDeleted })
            .HasDatabaseName("IX_Post_Status");

        builder.HasIndex(p => p.IsFeatured)
            .HasDatabaseName("IX_Post_IsFeatured");
    }
}
