namespace TechCommunity.Application.Common.Interfaces;

public interface ISlugService
{
    string GenerateSlug(string text);
    string GenerateUniqueSlug(string text, Func<string, bool> slugExists);
    Task<string> GenerateUniqueSlugAsync(string text, Func<string, Task<bool>> slugExistsAsync);
}
