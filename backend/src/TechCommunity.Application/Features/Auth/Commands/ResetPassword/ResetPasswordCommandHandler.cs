using MediatR;
using Microsoft.Extensions.Logging;
using TechCommunity.Application.Common.Exceptions;
using TechCommunity.Application.Common.Interfaces;

namespace TechCommunity.Application.Features.Auth.Commands.ResetPassword;

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<ResetPasswordCommandHandler> _logger;

    public ResetPasswordCommandHandler(
        IApplicationDbContext context,
        ILogger<ResetPasswordCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        // TODO: Find user by reset token
        // var user = await _context.Users
        //     .FirstOrDefaultAsync(u => 
        //         u.PasswordResetToken == request.Token && 
        //         u.PasswordResetTokenExpiry > DateTime.UtcNow, 
        //         cancellationToken);
        //
        // if (user == null)
        // {
        //     throw new ValidationException("Token", "Şifre sıfırlama linki geçersiz veya süresi dolmuş.");
        // }
        //
        // // Update password
        // user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        // user.PasswordResetToken = null;
        // user.PasswordResetTokenExpiry = null;
        //
        // // Revoke all refresh tokens
        // var refreshTokens = await _context.RefreshTokens
        //     .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
        //     .ToListAsync(cancellationToken);
        //
        // foreach (var token in refreshTokens)
        // {
        //     token.RevokedAt = DateTime.UtcNow;
        // }
        //
        // await _context.SaveChangesAsync(cancellationToken);
        //
        // _logger.LogInformation("Password reset successful for user {UserId}", user.Id);

        // For now, throw a not implemented exception
        _logger.LogWarning("Password reset not fully implemented yet. Token: {Token}", request.Token);
        throw new ValidationException("Token", "Şifre sıfırlama özelliği henüz tamamlanmadı.");
    }
}
