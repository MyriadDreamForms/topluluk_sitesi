using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.DisplayName)
            .HasMaxLength(100);

        builder.Property(u => u.Bio)
            .HasMaxLength(500);

        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        builder.Property(u => u.GitHubUrl)
            .HasMaxLength(200);

        builder.Property(u => u.TwitterUrl)
            .HasMaxLength(200);

        builder.Property(u => u.LinkedInUrl)
            .HasMaxLength(200);

        builder.Property(u => u.WebsiteUrl)
            .HasMaxLength(200);

        builder.Property(u => u.BanReason)
            .HasMaxLength(500);

        builder.Property(u => u.Role)
            .HasConversion<int>();

        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_User_Email");

        builder.HasIndex(u => u.Username)
            .IsUnique()
            .HasDatabaseName("IX_User_Username");

        builder.HasIndex(u => u.Role)
            .HasDatabaseName("IX_User_Role");
    }
}
