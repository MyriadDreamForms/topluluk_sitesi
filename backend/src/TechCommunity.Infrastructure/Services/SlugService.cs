using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Infrastructure.Services;

public class SlugService : ISlugService
{
    private static readonly Dictionary<char, string> TurkishCharMap = new()
    {
        { 'ş', "s" }, { 'Ş', "s" },
        { 'ı', "i" }, { 'İ', "i" },
        { 'ğ', "g" }, { 'Ğ', "g" },
        { 'ü', "u" }, { 'Ü', "u" },
        { 'ö', "o" }, { 'Ö', "o" },
        { 'ç', "c" }, { 'Ç', "c" }
    };

    public string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Convert Turkish characters
        var sb = new StringBuilder();
        foreach (var c in text)
        {
            if (TurkishCharMap.TryGetValue(c, out var replacement))
                sb.Append(replacement);
            else
                sb.Append(c);
        }

        var result = sb.ToString();

        // Remove diacritics
        result = RemoveDiacritics(result);

        // Convert to lowercase
        result = result.ToLowerInvariant();

        // Replace spaces with hyphens
        result = Regex.Replace(result, @"\s+", "-");

        // Remove invalid characters
        result = Regex.Replace(result, @"[^a-z0-9\-]", "");

        // Remove multiple hyphens
        result = Regex.Replace(result, @"-+", "-");

        // Trim hyphens from start and end
        result = result.Trim('-');

        // Limit length
        if (result.Length > 200)
            result = result.Substring(0, 200).TrimEnd('-');

        return result;
    }

    public string GenerateUniqueSlug(string text, Func<string, bool> slugExists)
    {
        var baseSlug = GenerateSlug(text);

        if (!slugExists(baseSlug))
            return baseSlug;

        var counter = 1;
        string newSlug;
        do
        {
            newSlug = $"{baseSlug}-{counter}";
            counter++;
        } while (slugExists(newSlug));

        return newSlug;
    }

    public async Task<string> GenerateUniqueSlugAsync(string text, Func<string, Task<bool>> slugExistsAsync)
    {
        var baseSlug = GenerateSlug(text);

        if (!await slugExistsAsync(baseSlug))
            return baseSlug;

        var counter = 1;
        string newSlug;
        do
        {
            newSlug = $"{baseSlug}-{counter}";
            counter++;
        } while (await slugExistsAsync(newSlug));

        return newSlug;
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
