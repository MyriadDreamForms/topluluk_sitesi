using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("Events");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Slug)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(5000);

        builder.Property(e => e.Location)
            .HasMaxLength(500);

        builder.Property(e => e.OnlineUrl)
            .HasMaxLength(500);

        builder.Property(e => e.ImageUrl)
            .HasMaxLength(500);

        builder.Property(e => e.EventType)
            .HasConversion<int>();

        builder.HasOne(e => e.CreatedBy)
            .WithMany(u => u.CreatedEvents)
            .HasForeignKey(e => e.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Event_Slug");

        builder.HasIndex(e => e.StartDate)
            .HasDatabaseName("IX_Event_StartDate");

        builder.HasIndex(e => e.CreatedById)
            .HasDatabaseName("IX_Event_CreatedById");

        builder.HasIndex(e => new { e.IsPublished, e.StartDate })
            .HasDatabaseName("IX_Event_IsPublished_StartDate");
    }
}
