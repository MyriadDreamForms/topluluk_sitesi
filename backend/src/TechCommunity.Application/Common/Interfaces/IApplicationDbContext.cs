using Microsoft.EntityFrameworkCore;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Post> Posts { get; }
    DbSet<Question> Questions { get; }
    DbSet<Answer> Answers { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Tag> Tags { get; }
    DbSet<Event> Events { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<PostTag> PostTags { get; }
    DbSet<QuestionTag> QuestionTags { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
