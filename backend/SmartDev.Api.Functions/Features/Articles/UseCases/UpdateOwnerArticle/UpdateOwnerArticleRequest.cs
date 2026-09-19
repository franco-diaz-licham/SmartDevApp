using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.UpdateOwnerArticle;

public sealed record UpdateArticleRequest(
    string Title,
    string Slug,
    string Summary,
    string? ArticleType,
    ArticleCategoryRequest Category,
    IReadOnlyCollection<ArticleTagRequest> Tags,
    string BodyMarkdown,
    string? Status,
    string? Visibility)
{
    public Result<UpdateArticleCommand> ToCommandResult(Guid articleId)
    {
        return ArticleEditMapping.BindCommand(() => new UpdateArticleCommand(
            articleId,
            Title,
            Slug,
            Summary,
            ArticleEditMapping.BindArticleType(ArticleType),
            Category.ToInput(),
            Tags.ToInput(),
            BodyMarkdown,
            ArticleEditMapping.BindArticleStatus(Status),
            ArticleEditMapping.BindArticleVisibility(Visibility)));
    }
}
