using Microsoft.Extensions.Logging;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Infrastructure.Services.FileStorage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly ILogger<LocalFileStorageService> _logger;
    private readonly string _basePath;
    private readonly string _baseUrl;

    public LocalFileStorageService(ILogger<LocalFileStorageService> logger)
    {
        _logger = logger;
        _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        _baseUrl = "/uploads";
        
        // Ensure the uploads directory exists
        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
        }
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        try
        {
            var filePath = Path.Combine(_basePath, fileName);
            var directory = Path.GetDirectoryName(filePath);
            
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            await using var targetStream = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            await fileStream.CopyToAsync(targetStream, cancellationToken);

            var url = $"{_baseUrl}/{fileName}";
            _logger.LogInformation("File uploaded successfully: {FilePath}", url);
            
            return url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName}", fileName);
            throw;
        }
    }

    public Task DeleteAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var relativePath = fileUrl.StartsWith(_baseUrl) 
                ? fileUrl.Substring(_baseUrl.Length + 1) 
                : fileUrl;
            
            var filePath = Path.Combine(_basePath, relativePath);
            
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileUrl}", fileUrl);
            // Don't throw - file deletion failures shouldn't break the application
        }
        
        return Task.CompletedTask;
    }

    public Task<Stream?> GetAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var relativePath = fileUrl.StartsWith(_baseUrl) 
                ? fileUrl.Substring(_baseUrl.Length + 1) 
                : fileUrl;
            
            var filePath = Path.Combine(_basePath, relativePath);
            
            if (File.Exists(filePath))
            {
                return Task.FromResult<Stream?>(new FileStream(filePath, FileMode.Open, FileAccess.Read));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting file: {FileUrl}", fileUrl);
        }
        
        return Task.FromResult<Stream?>(null);
    }

    public Task<bool> ExistsAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        var relativePath = fileUrl.StartsWith(_baseUrl) 
            ? fileUrl.Substring(_baseUrl.Length + 1) 
            : fileUrl;
        
        var filePath = Path.Combine(_basePath, relativePath);
        
        return Task.FromResult(File.Exists(filePath));
    }
}
