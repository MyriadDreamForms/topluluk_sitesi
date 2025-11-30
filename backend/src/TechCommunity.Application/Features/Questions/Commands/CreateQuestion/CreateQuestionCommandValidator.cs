using FluentValidation;

namespace TechCommunity.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommand>
{
    public CreateQuestionCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Başlık gereklidir.")
            .MinimumLength(10).WithMessage("Başlık en az 10 karakter olmalıdır.")
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir.");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Soru içeriği gereklidir.")
            .MinimumLength(30).WithMessage("Soru içeriği en az 30 karakter olmalıdır.")
            .MaximumLength(50000).WithMessage("Soru içeriği en fazla 50000 karakter olabilir.");

        RuleFor(x => x.TagNames)
            .Must(tags => tags.Count <= 5).WithMessage("En fazla 5 etiket eklenebilir.");

        RuleForEach(x => x.TagNames)
            .NotEmpty().WithMessage("Etiket adı boş olamaz.")
            .MaximumLength(30).WithMessage("Etiket adı en fazla 30 karakter olabilir.");
    }
}
