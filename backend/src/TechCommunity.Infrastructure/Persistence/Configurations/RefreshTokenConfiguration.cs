using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Token)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(r => r.CreatedByIp)
            .HasMaxLength(45);

        builder.Property(r => r.RevokedByIp)
            .HasMaxLength(45);

        builder.HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.ReplacedByToken)
            .WithOne()
            .HasForeignKey<RefreshToken>(r => r.ReplacedByTokenId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(r => r.UserId)
            .HasDatabaseName("IX_RefreshToken_UserId");

        builder.HasIndex(r => r.Token)
            .IsUnique()
            .HasDatabaseName("IX_RefreshToken_Token");

        builder.HasIndex(r => r.TokenFamily)
            .HasDatabaseName("IX_RefreshToken_TokenFamily");

        builder.HasIndex(r => r.ExpiresAt)
            .HasDatabaseName("IX_RefreshToken_ExpiresAt");

        builder.Ignore(r => r.IsExpired);
        builder.Ignore(r => r.IsRevoked);
        builder.Ignore(r => r.IsActive);
    }
}
