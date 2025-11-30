using FluentValidation;

namespace TechCommunity.Application.Features.Comments.Commands.AddComment;

public class AddCommentCommandValidator : AbstractValidator<AddCommentCommand>
{
    public AddCommentCommandValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Yorum içeriği zorunludur.")
            .MinimumLength(2).WithMessage("Yorum en az 2 karakter olmalıdır.")
            .MaximumLength(5000).WithMessage("Yorum en fazla 5000 karakter olabilir.");

        RuleFor(x => x)
            .Must(x => x.PostId.HasValue || x.QuestionId.HasValue)
            .WithMessage("Post veya Question ID gereklidir.");

        RuleFor(x => x)
            .Must(x => !(x.PostId.HasValue && x.QuestionId.HasValue))
            .WithMessage("Aynı anda hem Post hem Question ID belirtilemez.");
    }
}
