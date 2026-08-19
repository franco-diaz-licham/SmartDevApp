using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Api.Functions.Functions;

internal static class ArticleRequestMapping
{
    public static Result<CreateArticleCommand> ToCommandResult(this CreateArticleRequest request)
    {
        try {
            return Result<CreateArticleCommand>.Success(request.ToCommand());
        } catch (ArgumentException exception) {
            return Result<CreateArticleCommand>.Fail(exception.Message, ResultTypeEnum.Invalid);
        }
    }

    public static Result<UpdateArticleCommand> ToCommandResult(this UpdateArticleRequest request, Guid articleId)
    {
        try {
            return Result<UpdateArticleCommand>.Success(request.ToCommand(articleId));
        } catch (ArgumentException exception) {
            return Result<UpdateArticleCommand>.Fail(exception.Message, ResultTypeEnum.Invalid);
        }
    }

    private static CreateArticleCommand ToCommand(this CreateArticleRequest request)
    {
        return new CreateArticleCommand(
            request.Title,
            request.Slug,
            request.Summary,
            request.Category is null ? null : new CreateArticleCategory(request.Category.Slug, request.Category.DisplayName),
            request.Tags?.Select(tag => new CreateArticleTag(tag.Slug, tag.DisplayName)).ToArray(),
            request.BodyMarkdown,
            BindArticleStatus(request.Status),
            BindArticleVisibility(request.Visibility));
    }

    private static UpdateArticleCommand ToCommand(this UpdateArticleRequest request, Guid articleId)
    {
        return new UpdateArticleCommand(
            articleId,
            request.Title,
            request.Slug,
            request.Summary,
            request.Category is null ? null : new CreateArticleCategory(request.Category.Slug, request.Category.DisplayName),
            request.Tags?.Select(tag => new CreateArticleTag(tag.Slug, tag.DisplayName)).ToArray(),
            request.BodyMarkdown,
            BindArticleStatus(request.Status),
            BindArticleVisibility(request.Visibility));
    }

    private static ArticleStatus BindArticleStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return ArticleStatus.Draft;
        if (Enum.TryParse<ArticleStatus>(status.Trim(), ignoreCase: true, out var parsedStatus) && Enum.IsDefined(parsedStatus)) return parsedStatus;
        throw new ArgumentException("Article status must be Draft, Published, or Archived.");
    }

    private static ArticleVisibility BindArticleVisibility(string? visibility)
    {
        if (string.IsNullOrWhiteSpace(visibility)) return ArticleVisibility.Private;
        if (Enum.TryParse<ArticleVisibility>(visibility.Trim(), ignoreCase: true, out var parsedVisibility) && Enum.IsDefined(parsedVisibility)) return parsedVisibility;
        throw new ArgumentException("Article visibility must be Private or Public.");
    }
}
