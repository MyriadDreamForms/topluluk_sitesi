using FluentValidation;

namespace TechCommunity.Application.Features.Users.Commands.UpdateProfile;

public class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        RuleFor(x => x.DisplayName)
            .MinimumLength(2).WithMessage("Görünen ad en az 2 karakter olmalıdır.")
            .MaximumLength(100).WithMessage("Görünen ad en fazla 100 karakter olabilir.")
            .When(x => !string.IsNullOrEmpty(x.DisplayName));

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithMessage("Biyografi en fazla 500 karakter olabilir.")
            .When(x => !string.IsNullOrEmpty(x.Bio));

        RuleFor(x => x.GitHubUrl)
            .MaximumLength(200).WithMessage("GitHub URL en fazla 200 karakter olabilir.")
            .Must(BeAValidUrl).WithMessage("Geçerli bir GitHub URL giriniz.")
            .When(x => !string.IsNullOrEmpty(x.GitHubUrl));

        RuleFor(x => x.TwitterUrl)
            .MaximumLength(200).WithMessage("Twitter URL en fazla 200 karakter olabilir.")
            .Must(BeAValidUrl).WithMessage("Geçerli bir Twitter URL giriniz.")
            .When(x => !string.IsNullOrEmpty(x.TwitterUrl));

        RuleFor(x => x.LinkedInUrl)
            .MaximumLength(200).WithMessage("LinkedIn URL en fazla 200 karakter olabilir.")
            .Must(BeAValidUrl).WithMessage("Geçerli bir LinkedIn URL giriniz.")
            .When(x => !string.IsNullOrEmpty(x.LinkedInUrl));

        RuleFor(x => x.WebsiteUrl)
            .MaximumLength(200).WithMessage("Website URL en fazla 200 karakter olabilir.")
            .Must(BeAValidUrl).WithMessage("Geçerli bir URL giriniz.")
            .When(x => !string.IsNullOrEmpty(x.WebsiteUrl));
    }

    private bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
