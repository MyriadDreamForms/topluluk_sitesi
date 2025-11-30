using FluentValidation;

namespace TechCommunity.Application.Features.Answers.Commands.AddAnswer;

public class AddAnswerCommandValidator : AbstractValidator<AddAnswerCommand>
{
    public AddAnswerCommandValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("Soru ID'si gereklidir.");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Cevap içeriği gereklidir.")
            .MinimumLength(10).WithMessage("Cevap en az 10 karakter olmalıdır.")
            .MaximumLength(50000).WithMessage("Cevap en fazla 50000 karakter olabilir.");
    }
}
