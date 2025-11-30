using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Auth.Commands.ForgotPassword;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<ForgotPasswordCommandHandler> _logger;
    // private readonly IEmailService _emailService; // TODO: Add email service

    public ForgotPasswordCommandHandler(
        IApplicationDbContext context,
        ILogger<ForgotPasswordCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        // Find user by email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower(), cancellationToken);

        // Always return success to prevent email enumeration attacks
        if (user == null)
        {
            _logger.LogInformation("Password reset requested for non-existent email: {Email}", request.Email);
            return Unit.Value;
        }

        if (user.IsBanned)
        {
            _logger.LogInformation("Password reset requested for banned user: {UserId}", user.Id);
            return Unit.Value;
        }

        // Generate password reset token
        var resetToken = GenerateResetToken();
        var resetTokenExpiry = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour

        // Store reset token (we'll add these fields to User entity later)
        // For now, we'll log the token for testing purposes
        // user.PasswordResetToken = resetToken;
        // user.PasswordResetTokenExpiry = resetTokenExpiry;
        // await _context.SaveChangesAsync(cancellationToken);

        // TODO: Send email with reset link
        // var resetLink = $"https://turkiye-tech.com/auth/reset-password?token={resetToken}";
        // await _emailService.SendPasswordResetEmailAsync(user.Email, user.DisplayName, resetLink);

        _logger.LogInformation(
            "Password reset token generated for user {UserId}. Token: {Token} (This should be sent via email in production)",
            user.Id, resetToken);

        return Unit.Value;
    }

    private static string GenerateResetToken()
    {
        var tokenBytes = new byte[32];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(tokenBytes);
        return Convert.ToBase64String(tokenBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }
}
