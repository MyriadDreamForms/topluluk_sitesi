namespace TechCommunity.Application.Common.Interfaces;

public interface IMarkdownService
{
    string ToHtml(string markdown);
    string Sanitize(string html);
}
