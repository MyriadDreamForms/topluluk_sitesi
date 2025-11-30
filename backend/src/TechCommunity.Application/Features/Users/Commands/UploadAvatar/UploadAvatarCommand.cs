using MediatR;
using Microsoft.AspNetCore.Http;
using TechCommunity.Application.Features.Users.DTOs;

namespace TechCommunity.Application.Features.Users.Commands.UploadAvatar;

public record UploadAvatarCommand(IFormFile File) : IRequest<UserProfileDto>;
