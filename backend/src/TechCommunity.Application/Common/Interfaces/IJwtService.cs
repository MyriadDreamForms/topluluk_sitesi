using TechCommunity.Domain.Entities;

namespace TechCommunity.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Guid? ValidateAccessToken(string token);
    int AccessTokenExpiryMinutes { get; }
    int RefreshTokenExpiryDays { get; }
    
    /// <summary>
    /// Generates both access and refresh tokens for a user
    /// </summary>
    /// <param name="user">The user to generate tokens for</param>
    /// <param name="tokenFamily">Optional token family for refresh token rotation</param>
    /// <param name="previousTokenId">Optional previous token ID for token rotation tracking</param>
    /// <returns>A tuple containing (accessToken, refreshToken, expiresInSeconds)</returns>
    Task<(string accessToken, string refreshToken, int expiresIn)> GenerateTokensAsync(
        User user, 
        Guid? tokenFamily = null, 
        Guid? previousTokenId = null);
}
