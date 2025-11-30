using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechCommunity.Application.Common.Interfaces;
using System.Text;
using System.Xml.Linq;

namespace TechCommunity.API.Controllers;

/// <summary>
/// Controller for SEO-related endpoints (sitemap, robots.txt)
/// </summary>
[Route("")]
[ApiController]
public class SeoController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public SeoController(IApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Generate sitemap.xml dynamically
    /// </summary>
    [HttpGet("sitemap.xml")]
    [ResponseCache(Duration = 3600)] // Cache for 1 hour
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap(CancellationToken cancellationToken)
    {
        var baseUrl = _configuration["App:BaseUrl"] ?? "https://techcommunity.com.tr";

        XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";

        var urls = new List<XElement>
        {
            // Static pages
            CreateUrlElement(ns, baseUrl, "/", "daily", "1.0"),
            CreateUrlElement(ns, baseUrl, "/posts", "daily", "0.9"),
            CreateUrlElement(ns, baseUrl, "/questions", "daily", "0.9"),
            CreateUrlElement(ns, baseUrl, "/events", "daily", "0.8"),
            CreateUrlElement(ns, baseUrl, "/tags", "weekly", "0.7"),
            CreateUrlElement(ns, baseUrl, "/about", "monthly", "0.5"),
            CreateUrlElement(ns, baseUrl, "/guidelines", "monthly", "0.4"),
            CreateUrlElement(ns, baseUrl, "/faq", "monthly", "0.4"),
            CreateUrlElement(ns, baseUrl, "/contact", "monthly", "0.4"),
        };

        // Add published posts
        var posts = await _context.Posts
            .Where(p => p.IsPublished && !p.IsDeleted)
            .OrderByDescending(p => p.PublishedAt)
            .Take(1000)
            .Select(p => new { p.Slug, p.UpdatedAt, p.PublishedAt })
            .ToListAsync(cancellationToken);

        foreach (var post in posts)
        {
            var lastMod = (post.UpdatedAt ?? post.PublishedAt)?.ToString("yyyy-MM-dd");
            urls.Add(CreateUrlElement(ns, baseUrl, $"/posts/{post.Slug}", "weekly", "0.8", lastMod));
        }

        // Add questions
        var questions = await _context.Questions
            .Where(q => !q.IsDeleted)
            .OrderByDescending(q => q.CreatedAt)
            .Take(1000)
            .Select(q => new { q.Slug, q.UpdatedAt, q.CreatedAt })
            .ToListAsync(cancellationToken);

        foreach (var question in questions)
        {
            var lastMod = (question.UpdatedAt ?? question.CreatedAt).ToString("yyyy-MM-dd");
            urls.Add(CreateUrlElement(ns, baseUrl, $"/questions/{question.Slug}", "weekly", "0.8", lastMod));
        }

        // Add upcoming events
        var events = await _context.Events
            .Where(e => e.IsPublished && e.StartDate > DateTime.UtcNow.AddDays(-7))
            .OrderByDescending(e => e.StartDate)
            .Take(100)
            .Select(e => new { e.Slug, e.UpdatedAt, e.CreatedAt })
            .ToListAsync(cancellationToken);

        foreach (var evt in events)
        {
            var lastMod = (evt.UpdatedAt ?? evt.CreatedAt).ToString("yyyy-MM-dd");
            urls.Add(CreateUrlElement(ns, baseUrl, $"/events/{evt.Slug}", "daily", "0.7", lastMod));
        }

        // Add popular tags
        var tags = await _context.Tags
            .OrderByDescending(t => t.PostCount + t.QuestionCount)
            .Take(100)
            .Select(t => t.Slug)
            .ToListAsync(cancellationToken);

        foreach (var tagSlug in tags)
        {
            urls.Add(CreateUrlElement(ns, baseUrl, $"/tags/{tagSlug}", "daily", "0.6"));
        }

        // Add active users (public profiles)
        var users = await _context.Users
            .Where(u => !u.IsBanned)
            .OrderByDescending(u => u.CreatedAt)
            .Take(500)
            .Select(u => u.Username)
            .ToListAsync(cancellationToken);

        foreach (var username in users)
        {
            urls.Add(CreateUrlElement(ns, baseUrl, $"/u/{username}", "weekly", "0.5"));
        }

        var sitemap = new XDocument(
            new XDeclaration("1.0", "UTF-8", null),
            new XElement(ns + "urlset", urls)
        );

        return Content(sitemap.Declaration + Environment.NewLine + sitemap.ToString(), "application/xml", Encoding.UTF8);
    }

    /// <summary>
    /// Serve robots.txt
    /// </summary>
    [HttpGet("robots.txt")]
    [ResponseCache(Duration = 86400)] // Cache for 24 hours
    [Produces("text/plain")]
    public IActionResult GetRobots()
    {
        var baseUrl = _configuration["App:BaseUrl"] ?? "https://techcommunity.com.tr";

        var robotsTxt = $@"# TechCommunity Türkiye - robots.txt
# https://techcommunity.com.tr

User-agent: *

# Allow all public content
Allow: /
Allow: /posts/
Allow: /questions/
Allow: /events/
Allow: /tags/
Allow: /u/
Allow: /about
Allow: /guidelines
Allow: /faq
Allow: /contact
Allow: /privacy
Allow: /terms

# Disallow private/admin areas
Disallow: /admin/
Disallow: /profile/settings
Disallow: /profile/notifications
Disallow: /auth/

# Disallow API endpoints
Disallow: /api/

# Disallow edit pages (require auth)
Disallow: /posts/new
Disallow: /posts/*/edit
Disallow: /questions/ask
Disallow: /questions/*/edit
Disallow: /events/new
Disallow: /events/*/edit

# Crawl delay for polite crawling
Crawl-delay: 1

# Sitemap location
Sitemap: {baseUrl}/sitemap.xml
";

        return Content(robotsTxt, "text/plain", Encoding.UTF8);
    }

    private static XElement CreateUrlElement(
        XNamespace ns,
        string baseUrl,
        string path,
        string changefreq,
        string priority,
        string? lastmod = null)
    {
        var elements = new List<XElement>
        {
            new XElement(ns + "loc", $"{baseUrl}{path}"),
            new XElement(ns + "changefreq", changefreq),
            new XElement(ns + "priority", priority)
        };

        if (!string.IsNullOrEmpty(lastmod))
        {
            elements.Insert(1, new XElement(ns + "lastmod", lastmod));
        }

        return new XElement(ns + "url", elements);
    }
}
