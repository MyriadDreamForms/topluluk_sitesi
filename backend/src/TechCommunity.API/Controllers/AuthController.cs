using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TechCommunity.Application.Features.Auth.Commands.ForgotPassword;
using TechCommunity.Application.Features.Auth.Commands.Login;
using TechCommunity.Application.Features.Auth.Commands.Logout;
using TechCommunity.Application.Features.Auth.Commands.RefreshToken;
using TechCommunity.Application.Features.Auth.Commands.Register;
using TechCommunity.Application.Features.Auth.Commands.ResetPassword;

namespace TechCommunity.API.Controllers;

[Route("api/[controller]")]
public class AuthController : BaseApiController
{
    /// <summary>
    /// Yeni kullanıcı kaydı
    /// </summary>
    [HttpPost("register")]
    [EnableRateLimiting("login")]
    [ProducesResponseType(typeof(AuthResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await Mediator.Send(command);
        return CreatedAtAction(nameof(Register), Success(result, "Kayıt başarılı."));
    }

    /// <summary>
    /// Kullanıcı girişi
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    [ProducesResponseType(typeof(AuthResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(Success(result, "Giriş başarılı."));
    }

    /// <summary>
    /// Token yenileme
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(Success(result));
    }

    /// <summary>
    /// Kullanıcı çıkışı
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout([FromBody] LogoutCommand command)
    {
        await Mediator.Send(command);
        return Ok(Success<object>(null, "Çıkış başarılı."));
    }

    /// <summary>
    /// Şifre sıfırlama isteği
    /// </summary>
    [HttpPost("forgot-password")]
    [EnableRateLimiting("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        await Mediator.Send(command);
        // Always return success to prevent email enumeration
        return Ok(Success<object>(null, "E-posta adresiniz kayıtlıysa şifre sıfırlama bağlantısı gönderildi."));
    }

    /// <summary>
    /// Şifre sıfırlama
    /// </summary>
    [HttpPost("reset-password")]
    [EnableRateLimiting("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        await Mediator.Send(command);
        return Ok(Success<object>(null, "Şifreniz başarıyla sıfırlandı."));
    }
}
