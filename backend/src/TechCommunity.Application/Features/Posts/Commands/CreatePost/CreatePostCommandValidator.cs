using FluentValidation;

namespace TechCommunity.Application.Features.Posts.Commands.CreatePost;

public class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Başlık zorunludur.")
            .MinimumLength(5).WithMessage("Başlık en az 5 karakter olmalıdır.")
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("İçerik zorunludur.")
            .MinimumLength(50).WithMessage("İçerik en az 50 karakter olmalıdır.")
            .MaximumLength(50000).WithMessage("İçerik en fazla 50000 karakter olabilir.");

        RuleFor(x => x.Excerpt)
            .MaximumLength(500).WithMessage("Özet en fazla 500 karakter olabilir.")
            .When(x => !string.IsNullOrEmpty(x.Excerpt));

        RuleFor(x => x.CoverImageUrl)
            .Must(BeAValidUrl).WithMessage("Geçerli bir URL giriniz.")
            .When(x => !string.IsNullOrEmpty(x.CoverImageUrl));

        RuleFor(x => x.Tags)
            .Must(tags => tags.Count <= 5).WithMessage("En fazla 5 etiket eklenebilir.");

        RuleForEach(x => x.Tags)
            .NotEmpty().WithMessage("Etiket boş olamaz.")
            .MaximumLength(30).WithMessage("Etiket en fazla 30 karakter olabilir.");
    }

    private bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var result)
            && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}
