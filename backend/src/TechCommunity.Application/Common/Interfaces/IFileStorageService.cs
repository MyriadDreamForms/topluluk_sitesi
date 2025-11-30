namespace TechCommunity.Application.Common.Interfaces;

public interface IFileStorageService
{
    /// <summary>
    /// Uploads a file and returns the URL
    /// </summary>
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Deletes a file by its URL or path
    /// </summary>
    Task DeleteAsync(string fileUrl, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets a file stream by its URL or path
    /// </summary>
    Task<Stream?> GetAsync(string fileUrl, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if a file exists
    /// </summary>
    Task<bool> ExistsAsync(string fileUrl, CancellationToken cancellationToken = default);
}
