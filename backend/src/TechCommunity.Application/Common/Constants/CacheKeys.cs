namespace TechCommunity.Application.Common.Constants;

/// <summary>
/// Centralized cache key constants for consistent cache management
/// </summary>
public static class CacheKeys
{
    // Tag cache keys
    public const string TagsPrefix = "tags:";
    public const string AllTags = "tags:all";
    public const string PopularTags = "tags:popular";
    public const string TagBySlug = "tags:slug:"; // + slug
    public const string TagById = "tags:id:"; // + id
    
    // Feed cache keys
    public const string FeedPrefix = "feed:";
    public const string FeedLatest = "feed:latest";
    public const string FeedTrending = "feed:trending";
    public const string FeedPopular = "feed:popular";
    public const string FeedByTag = "feed:tag:"; // + tagSlug
    
    // Post cache keys
    public const string PostsPrefix = "posts:";
    public const string PostBySlug = "posts:slug:"; // + slug
    public const string PostById = "posts:id:"; // + id
    public const string PostsFeatured = "posts:featured";
    
    // Question cache keys
    public const string QuestionsPrefix = "questions:";
    public const string QuestionBySlug = "questions:slug:"; // + slug
    public const string QuestionById = "questions:id:"; // + id
    
    // Event cache keys
    public const string EventsPrefix = "events:";
    public const string EventBySlug = "events:slug:"; // + slug
    public const string EventsUpcoming = "events:upcoming";
    
    // User cache keys
    public const string UsersPrefix = "users:";
    public const string UserByUsername = "users:username:"; // + username
    public const string UserById = "users:id:"; // + id
    
    // Search cache keys
    public const string SearchPrefix = "search:";
    
    // Statistics cache keys
    public const string StatsPrefix = "stats:";
    public const string StatsDashboard = "stats:dashboard";
    
    /// <summary>
    /// Generates a cache key for a specific tag by slug
    /// </summary>
    public static string GetTagBySlugKey(string slug) => $"{TagBySlug}{slug}";
    
    /// <summary>
    /// Generates a cache key for a specific post by slug
    /// </summary>
    public static string GetPostBySlugKey(string slug) => $"{PostBySlug}{slug}";
    
    /// <summary>
    /// Generates a cache key for a specific question by slug
    /// </summary>
    public static string GetQuestionBySlugKey(string slug) => $"{QuestionBySlug}{slug}";
    
    /// <summary>
    /// Generates a cache key for a specific event by slug
    /// </summary>
    public static string GetEventBySlugKey(string slug) => $"{EventBySlug}{slug}";
    
    /// <summary>
    /// Generates a cache key for a specific user by username
    /// </summary>
    public static string GetUserByUsernameKey(string username) => $"{UserByUsername}{username}";
    
    /// <summary>
    /// Generates a cache key for feed by tag
    /// </summary>
    public static string GetFeedByTagKey(string tagSlug) => $"{FeedByTag}{tagSlug}";
}
