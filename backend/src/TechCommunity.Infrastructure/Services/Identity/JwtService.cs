using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Domain.Entities;

namespace TechCommunity.Infrastructure.Services.Identity;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly IApplicationDbContext _context;

    public JwtService(IConfiguration configuration, IApplicationDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    public int AccessTokenExpiryMinutes => _configuration.GetValue<int>("Jwt:AccessTokenExpiryMinutes", 30);
    public int RefreshTokenExpiryDays => _configuration.GetValue<int>("Jwt:RefreshTokenExpiryDays", 7);

    public string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured")));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(AccessTokenExpiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public Guid? ValidateAccessToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(
                _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out var validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = Guid.Parse(jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value);

            return userId;
        }
        catch
        {
            return null;
        }
    }

    public async Task<(string accessToken, string refreshToken, int expiresIn)> GenerateTokensAsync(
        User user, 
        Guid? tokenFamily = null, 
        Guid? previousTokenId = null)
    {
        // Generate access token
        var accessToken = GenerateAccessToken(user);
        
        // Generate refresh token
        var refreshTokenValue = GenerateRefreshToken();
        var family = tokenFamily ?? Guid.NewGuid();
        
        // If there's a previous token, revoke it
        if (previousTokenId.HasValue)
        {
            var previousToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Id == previousTokenId);
            
            if (previousToken != null)
            {
                previousToken.RevokedAt = DateTime.UtcNow;
            }
        }
        
        // Create new refresh token
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            TokenFamily = family,
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            ReplacedByTokenId = null
        };
        
        // Link the previous token to the new one
        if (previousTokenId.HasValue)
        {
            var previousToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Id == previousTokenId);
            
            if (previousToken != null)
            {
                previousToken.ReplacedByTokenId = refreshToken.Id;
            }
        }
        
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return (accessToken, refreshTokenValue, AccessTokenExpiryMinutes * 60);
    }
}
