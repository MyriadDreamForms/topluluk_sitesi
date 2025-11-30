using TechCommunity.Application.Common.Constants;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Common.Services;

/// <summary>
/// Service responsible for cache invalidation across different content types
/// </summary>
public interface ICacheInvalidationService
{
    /// <summary>
    /// Invalidates all tag-related caches
    /// </summary>
    Task InvalidateTagCachesAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Invalidates all feed-related caches
    /// </summary>
    Task InvalidateFeedCachesAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Invalidates caches when a post is created, updated or deleted
    /// </summary>
    Task InvalidatePostCachesAsync(string? postSlug = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Invalidates caches when a question is created, updated or deleted
    /// </summary>
    Task InvalidateQuestionCachesAsync(string? questionSlug = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Invalidates caches when an event is created, updated or deleted
    /// </summary>
    Task InvalidateEventCachesAsync(string? eventSlug = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Invalidates caches when a user profile is updated
    /// </summary>
    Task InvalidateUserCachesAsync(string? username = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Invalidates all content caches (for major changes)
    /// </summary>
    Task InvalidateAllContentCachesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Implementation of cache invalidation service
/// </summary>
public class CacheInvalidationService : ICacheInvalidationService
{
    private readonly ICacheService _cacheService;

    public CacheInvalidationService(ICacheService cacheService)
    {
        _cacheService = cacheService;
    }

    public async Task InvalidateTagCachesAsync(CancellationToken cancellationToken = default)
    {
        await _cacheService.RemoveByPrefixAsync(CacheKeys.TagsPrefix, cancellationToken);
    }

    public async Task InvalidateFeedCachesAsync(CancellationToken cancellationToken = default)
    {
        await _cacheService.RemoveByPrefixAsync(CacheKeys.FeedPrefix, cancellationToken);
    }

    public async Task InvalidatePostCachesAsync(string? postSlug = null, CancellationToken cancellationToken = default)
    {
        // Invalidate specific post if slug provided
        if (!string.IsNullOrEmpty(postSlug))
        {
            await _cacheService.RemoveAsync(CacheKeys.GetPostBySlugKey(postSlug), cancellationToken);
        }
        
        // Invalidate all post listings
        await _cacheService.RemoveByPrefixAsync(CacheKeys.PostsPrefix, cancellationToken);
        
        // Posts affect the feed
        await InvalidateFeedCachesAsync(cancellationToken);
        
        // Posts affect tag counts
        await InvalidateTagCachesAsync(cancellationToken);
        
        // Invalidate search cache
        await _cacheService.RemoveByPrefixAsync(CacheKeys.SearchPrefix, cancellationToken);
    }

    public async Task InvalidateQuestionCachesAsync(string? questionSlug = null, CancellationToken cancellationToken = default)
    {
        // Invalidate specific question if slug provided
        if (!string.IsNullOrEmpty(questionSlug))
        {
            await _cacheService.RemoveAsync(CacheKeys.GetQuestionBySlugKey(questionSlug), cancellationToken);
        }
        
        // Invalidate all question listings
        await _cacheService.RemoveByPrefixAsync(CacheKeys.QuestionsPrefix, cancellationToken);
        
        // Questions affect the feed
        await InvalidateFeedCachesAsync(cancellationToken);
        
        // Questions affect tag counts
        await InvalidateTagCachesAsync(cancellationToken);
        
        // Invalidate search cache
        await _cacheService.RemoveByPrefixAsync(CacheKeys.SearchPrefix, cancellationToken);
    }

    public async Task InvalidateEventCachesAsync(string? eventSlug = null, CancellationToken cancellationToken = default)
    {
        // Invalidate specific event if slug provided
        if (!string.IsNullOrEmpty(eventSlug))
        {
            await _cacheService.RemoveAsync(CacheKeys.GetEventBySlugKey(eventSlug), cancellationToken);
        }
        
        // Invalidate all event listings
        await _cacheService.RemoveByPrefixAsync(CacheKeys.EventsPrefix, cancellationToken);
        
        // Invalidate search cache
        await _cacheService.RemoveByPrefixAsync(CacheKeys.SearchPrefix, cancellationToken);
    }

    public async Task InvalidateUserCachesAsync(string? username = null, CancellationToken cancellationToken = default)
    {
        // Invalidate specific user if username provided
        if (!string.IsNullOrEmpty(username))
        {
            await _cacheService.RemoveAsync(CacheKeys.GetUserByUsernameKey(username), cancellationToken);
        }
        
        // Invalidate all user listings
        await _cacheService.RemoveByPrefixAsync(CacheKeys.UsersPrefix, cancellationToken);
        
        // Invalidate stats as user count may change
        await _cacheService.RemoveByPrefixAsync(CacheKeys.StatsPrefix, cancellationToken);
    }

    public async Task InvalidateAllContentCachesAsync(CancellationToken cancellationToken = default)
    {
        await InvalidateTagCachesAsync(cancellationToken);
        await InvalidateFeedCachesAsync(cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.PostsPrefix, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.QuestionsPrefix, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.EventsPrefix, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.SearchPrefix, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.StatsPrefix, cancellationToken);
    }
}
