using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Domain;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

public sealed record ArticleCategoryInput(string Slug, string DisplayName);

public sealed record ArticleTagInput(string Slug, string DisplayName);

public sealed record ArticleCategoryRequest(string Slug, string DisplayName);

public sealed record ArticleTagRequest(string Slug, string DisplayName);

internal static class ArticleEditMapping
{
    public static ArticleCategoryInput? ToInput(this ArticleCategoryRequest? request) => request is null ? null : new ArticleCategoryInput(request.Slug, request.DisplayName);

    public static IReadOnlyCollection<ArticleTagInput>? ToInput(this IReadOnlyCollection<ArticleTagRequest>? tags) => tags?.Select(tag => new ArticleTagInput(tag.Slug, tag.DisplayName)).ToArray();

    public static ArticleStatus BindArticleStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return ArticleStatus.Draft;
        if (Enum.TryParse<ArticleStatus>(status.Trim(), ignoreCase: true, out var parsedStatus) && Enum.IsDefined(parsedStatus)) return parsedStatus;
        throw new ArgumentException("Article status must be Draft, Published, or Archived.");
    }

    public static ArticleType BindArticleType(string? articleType)
    {
        if (string.IsNullOrWhiteSpace(articleType)) return ArticleType.DeepDive;
        if (Enum.TryParse<ArticleType>(articleType.Trim(), ignoreCase: true, out var parsedArticleType) && Enum.IsDefined(parsedArticleType)) return parsedArticleType;
        throw new ArgumentException("Article type must be DeepDive, BookSummary, ProjectWriteup, or Reflection.");
    }

    public static ArticleVisibility BindArticleVisibility(string? visibility)
    {
        if (string.IsNullOrWhiteSpace(visibility)) return ArticleVisibility.Private;
        if (Enum.TryParse<ArticleVisibility>(visibility.Trim(), ignoreCase: true, out var parsedVisibility) && Enum.IsDefined(parsedVisibility)) return parsedVisibility;
        throw new ArgumentException("Article visibility must be Private or Public.");
    }

    public static Result<TCommand> BindCommand<TCommand>(Func<TCommand> bind)
    {
        try {
            return Result<TCommand>.Success(bind());
        } catch (ArgumentException exception) {
            return Result<TCommand>.Fail(exception.Message, ResultTypeEnum.Invalid);
        }
    }
}
