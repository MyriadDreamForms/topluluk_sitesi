using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TechCommunity.Application.Common.Interfaces;
using TechCommunity.Infrastructure.Persistence;
using TechCommunity.Infrastructure.Services;
using TechCommunity.Infrastructure.Services.Caching;
using TechCommunity.Infrastructure.Services.FileStorage;
using TechCommunity.Infrastructure.Services.Identity;

namespace TechCommunity.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        // Services
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<ISlugService, SlugService>();
        services.AddSingleton<IMarkdownService, MarkdownService>();
        services.AddSingleton<ICacheService, CacheService>();
        services.AddSingleton<IFileStorageService, LocalFileStorageService>();

        // Caching
        services.AddMemoryCache();

        return services;
    }
}
