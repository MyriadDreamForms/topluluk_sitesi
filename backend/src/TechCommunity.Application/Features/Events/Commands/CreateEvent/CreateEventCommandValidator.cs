using FluentValidation;
using TechCommunity.Domain.Enums;

namespace TechCommunity.Application.Features.Events.Commands.CreateEvent;

public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Etkinlik başlığı gereklidir.")
            .MinimumLength(5).WithMessage("Etkinlik başlığı en az 5 karakter olmalıdır.")
            .MaximumLength(200).WithMessage("Etkinlik başlığı en fazla 200 karakter olmalıdır.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Etkinlik açıklaması gereklidir.")
            .MinimumLength(20).WithMessage("Etkinlik açıklaması en az 20 karakter olmalıdır.")
            .MaximumLength(10000).WithMessage("Etkinlik açıklaması en fazla 10000 karakter olmalıdır.");

        RuleFor(x => x.StartDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Başlangıç tarihi gelecekte olmalıdır.");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.EndDate.HasValue)
            .WithMessage("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");

        RuleFor(x => x.Location)
            .NotEmpty()
            .When(x => x.EventType == EventType.Offline)
            .WithMessage("Yüz yüze etkinlikler için konum gereklidir.");

        RuleFor(x => x.OnlineUrl)
            .NotEmpty()
            .When(x => x.EventType == EventType.Online)
            .WithMessage("Online etkinlikler için URL gereklidir.");

        RuleFor(x => x.OnlineUrl)
            .Must(BeAValidUrl)
            .When(x => !string.IsNullOrEmpty(x.OnlineUrl))
            .WithMessage("Geçerli bir URL giriniz.");
    }

    private static bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) 
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
