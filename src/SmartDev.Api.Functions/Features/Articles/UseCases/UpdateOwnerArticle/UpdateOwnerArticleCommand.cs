using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.UpdateOwnerArticle;

public sealed record UpdateArticleCommand(
    Guid ArticleId,
    string Title,
    string Slug,
    string Summary,
    ArticleType ArticleType,
    ArticleCategoryInput? Category,
    IReadOnlyCollection<ArticleTagInput>? Tags,
    string BodyMarkdown,
    ArticleStatus Status,
    ArticleVisibility Visibility);

public sealed record UpdateArticleResult(Guid ArticleId, string Slug);
