using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.CreateOwnerArticle;

public sealed record CreateArticleRequest(
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
    public Result<CreateArticleCommand> ToCommandResult()
    {
        return ArticleEditMapping.BindCommand(() => new CreateArticleCommand(
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
