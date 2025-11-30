using System.Text.RegularExpressions;
using System.Web;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Infrastructure.Services;

public class MarkdownService : IMarkdownService
{
    public string ToHtml(string markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown))
            return string.Empty;

        var html = markdown;

        // Code blocks (must be done first)
        html = Regex.Replace(html, @"```(\w*)\n([\s\S]*?)```", "<pre><code class=\"language-$1\">$2</code></pre>");
        html = Regex.Replace(html, @"`([^`]+)`", "<code>$1</code>");

        // Headers
        html = Regex.Replace(html, @"^######\s*(.+)$", "<h6>$1</h6>", RegexOptions.Multiline);
        html = Regex.Replace(html, @"^#####\s*(.+)$", "<h5>$1</h5>", RegexOptions.Multiline);
        html = Regex.Replace(html, @"^####\s*(.+)$", "<h4>$1</h4>", RegexOptions.Multiline);
        html = Regex.Replace(html, @"^###\s*(.+)$", "<h3>$1</h3>", RegexOptions.Multiline);
        html = Regex.Replace(html, @"^##\s*(.+)$", "<h2>$1</h2>", RegexOptions.Multiline);
        html = Regex.Replace(html, @"^#\s*(.+)$", "<h1>$1</h1>", RegexOptions.Multiline);

        // Bold and italic
        html = Regex.Replace(html, @"\*\*\*(.+?)\*\*\*", "<strong><em>$1</em></strong>");
        html = Regex.Replace(html, @"\*\*(.+?)\*\*", "<strong>$1</strong>");
        html = Regex.Replace(html, @"\*(.+?)\*", "<em>$1</em>");
        html = Regex.Replace(html, @"___(.+?)___", "<strong><em>$1</em></strong>");
        html = Regex.Replace(html, @"__(.+?)__", "<strong>$1</strong>");
        html = Regex.Replace(html, @"_(.+?)_", "<em>$1</em>");

        // Links
        html = Regex.Replace(html, @"\[([^\]]+)\]\(([^\)]+)\)", "<a href=\"$2\" target=\"_blank\" rel=\"noopener\">$1</a>");

        // Images
        html = Regex.Replace(html, @"!\[([^\]]*)\]\(([^\)]+)\)", "<img src=\"$2\" alt=\"$1\" />");

        // Blockquotes
        html = Regex.Replace(html, @"^>\s*(.+)$", "<blockquote>$1</blockquote>", RegexOptions.Multiline);

        // Unordered lists
        html = Regex.Replace(html, @"^[\*\-]\s+(.+)$", "<li>$1</li>", RegexOptions.Multiline);

        // Ordered lists
        html = Regex.Replace(html, @"^\d+\.\s+(.+)$", "<li>$1</li>", RegexOptions.Multiline);

        // Horizontal rule
        html = Regex.Replace(html, @"^[\*\-_]{3,}$", "<hr />", RegexOptions.Multiline);

        // Paragraphs
        html = Regex.Replace(html, @"\n\n+", "</p><p>");
        html = $"<p>{html}</p>";

        // Clean up empty paragraphs
        html = Regex.Replace(html, @"<p>\s*</p>", "");
        html = Regex.Replace(html, @"<p>(<h[1-6]>)", "$1");
        html = Regex.Replace(html, @"(</h[1-6]>)</p>", "$1");
        html = Regex.Replace(html, @"<p>(<pre>)", "$1");
        html = Regex.Replace(html, @"(</pre>)</p>", "$1");
        html = Regex.Replace(html, @"<p>(<blockquote>)", "$1");
        html = Regex.Replace(html, @"(</blockquote>)</p>", "$1");

        return html;
    }

    public string Sanitize(string html)
    {
        if (string.IsNullOrWhiteSpace(html))
            return string.Empty;

        // Remove script tags
        html = Regex.Replace(html, @"<script[^>]*>[\s\S]*?</script>", "", RegexOptions.IgnoreCase);

        // Remove style tags
        html = Regex.Replace(html, @"<style[^>]*>[\s\S]*?</style>", "", RegexOptions.IgnoreCase);

        // Remove onclick and other event handlers
        html = Regex.Replace(html, @"\s*on\w+\s*=\s*""[^""]*""", "", RegexOptions.IgnoreCase);
        html = Regex.Replace(html, @"\s*on\w+\s*=\s*'[^']*'", "", RegexOptions.IgnoreCase);

        // Remove javascript: urls
        html = Regex.Replace(html, @"javascript:", "", RegexOptions.IgnoreCase);

        return html;
    }
}
