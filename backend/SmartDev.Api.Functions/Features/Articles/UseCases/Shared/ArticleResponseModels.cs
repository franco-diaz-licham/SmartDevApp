using SmartDev.Api.Functions.Features.Articles.Domain;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

public sealed record PublicArticleListItem(
    string Id,
    string Slug,
    string Title,
    string Summary,
    string ArticleType,
    PublicArticleCategory Category,
    IReadOnlyCollection<PublicArticleTag> Tags,
    string Status,
    string Visibility,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset PublishedAt)
{
    public static PublicArticleListItem FromDomain(Article article)
    {
        return new PublicArticleListItem(
            article.Id.Value.ToString("D"),
            article.Slug.Value,
            article.Title.Value,
            article.Summary.Value,
            article.ArticleType.ToString(),
            PublicArticleCategory.FromDomain(article.Category),
            article.Tags.Select(PublicArticleTag.FromDomain).ToArray(),
            article.Status.ToString(),
            article.Visibility.ToString(),
            article.UpdatedAt,
            article.PublishedAt ?? article.UpdatedAt ?? article.CreatedAt);
    }
}

public sealed record PublicArticleDetail(
    string Id,
    string Slug,
    string Title,
    string Summary,
    string ArticleType,
    PublicArticleCategory Category,
    IReadOnlyCollection<PublicArticleTag> Tags,
    string Status,
    string Visibility,
    string BodyMarkdown,
    IReadOnlyCollection<PublicRelatedProjectReference> RelatedProjects,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset PublishedAt)
{
    public static PublicArticleDetail FromDomain(Article article)
    {
        return new PublicArticleDetail(
            article.Id.Value.ToString("D"),
            article.Slug.Value,
            article.Title.Value,
            article.Summary.Value,
            article.ArticleType.ToString(),
            PublicArticleCategory.FromDomain(article.Category),
            article.Tags.Select(PublicArticleTag.FromDomain).ToArray(),
            article.Status.ToString(),
            article.Visibility.ToString(),
            article.Body.Value,
            article.RelatedProjects.Select(project => new PublicRelatedProjectReference(project.ProjectId, project.Label)).ToArray(),
            article.UpdatedAt,
            article.PublishedAt ?? article.UpdatedAt ?? article.CreatedAt);
    }
}

public sealed record PublicRelatedProjectReference(string ProjectId, string Label);

public sealed record ArticleAudioPlayback(Stream Content, string ContentType, string ContentVersion);

public sealed record ArticleAudioGenerationRequest(string Status, string ContentVersion);

public sealed record PublicArticleCategory(string Slug, string DisplayName)
{
    public static PublicArticleCategory FromDomain(ArticleCategorySnapshot category) => new(category.Slug.Value, category.DisplayName);
}

public sealed record PublicArticleTag(string Slug, string DisplayName)
{
    public static PublicArticleTag FromDomain(ArticleTagSnapshot tag) => new(tag.Slug.Value, tag.DisplayName);
}

public sealed record PublicSearchIndexResponse(DateTimeOffset GeneratedAt, IReadOnlyCollection<PublicArticleSearchDocument> Documents);

public sealed record PublicArticleSearchDocument(
    string Id,
    string Type,
    string Slug,
    string Title,
    string Summary,
    string ArticleType,
    string Category,
    IReadOnlyCollection<string> Tags,
    string BodyText,
    string Url,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset? PublishedAt)
{
    public static PublicArticleSearchDocument FromDomain(Article article)
    {
        return new PublicArticleSearchDocument(
            article.Id.Value.ToString("D"),
            "article",
            article.Slug.Value,
            article.Title.Value,
            article.Summary.Value,
            article.ArticleType.ToString(),
            article.Category.DisplayName,
            article.Tags.Select(tag => tag.DisplayName).ToArray(),
            article.Body.Value,
            $"/workspace/articles/{article.Id.Value:D}",
            article.UpdatedAt,
            article.PublishedAt);
    }
}
