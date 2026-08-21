using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed class ArticlesQueryHandler(IArticleRepository articleRepository)
{
    public async Task<Result<Page<PublicArticleListItem>>> GetPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var articles = await articleRepository.GetPublishedPublicArticlesAsync(query, cancellationToken);
        var response = new Page<PublicArticleListItem>(articles.Items.Select(PublicArticleListItem.FromDomain).ToArray(), articles.ContinuationToken);
        return Result<Page<PublicArticleListItem>>.Success(response);
    }

    public async Task<Result<Page<PublicArticleListItem>>> GetOwnerArticlesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var articles = await articleRepository.GetAllForOwnerAsync(query, cancellationToken);
        var response = new Page<PublicArticleListItem>(articles.Items.Select(PublicArticleListItem.FromDomain).ToArray(), articles.ContinuationToken);
        return Result<Page<PublicArticleListItem>>.Success(response);
    }

    public async Task<Result<PublicArticleDetail>> GetOwnerArticleByIdAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(articleId), cancellationToken);
        return article is null
            ? Result<PublicArticleDetail>.Fail("Article was not found.", ResultTypeEnum.NotFound)
            : Result<PublicArticleDetail>.Success(PublicArticleDetail.FromDomain(article));
    }

    public async Task<Result<PublicArticleDetail>> GetPublicArticleByIdAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(articleId), cancellationToken);
        if (article is null || article.Status != ArticleStatus.Published || article.Visibility != ArticleVisibility.Public) {
            return Result<PublicArticleDetail>.Fail("Article was not found.", ResultTypeEnum.NotFound);
        }

        return Result<PublicArticleDetail>.Success(PublicArticleDetail.FromDomain(article));
    }

    public async Task<Result<Page<string>>> GetPublicArticleCategoriesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var categories = await articleRepository.GetPublishedPublicCategoryNamesAsync(query, cancellationToken);
        var response = new Page<string>(categories.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), categories.ContinuationToken);
        return Result<Page<string>>.Success(response);
    }

    public async Task<Result<Page<string>>> GetOwnerArticleCategoriesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var categories = await articleRepository.GetOwnerCategoryNamesAsync(query, cancellationToken);
        var response = new Page<string>(categories.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), categories.ContinuationToken);
        return Result<Page<string>>.Success(response);
    }

    public async Task<Result<Page<string>>> GetPublicArticleTagsAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var tags = await articleRepository.GetPublishedPublicTagNamesAsync(query, cancellationToken);
        var response = new Page<string>(tags.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), tags.ContinuationToken);
        return Result<Page<string>>.Success(response);
    }

    public async Task<Result<Page<PublicArticleListItem>>> SearchPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query.SearchTerm)) {
            return Result<Page<PublicArticleListItem>>.Success(new Page<PublicArticleListItem>([], null));
        }

        var articles = await articleRepository.SearchPublishedPublicArticlesAsync(query, cancellationToken);
        var response = new Page<PublicArticleListItem>(articles.Items.Select(PublicArticleListItem.FromDomain).ToArray(), articles.ContinuationToken);
        return Result<Page<PublicArticleListItem>>.Success(response);
    }

    public async Task<Result<PublicSearchIndexResponse>> GetPublicArticleSearchIndexAsync(CancellationToken cancellationToken)
    {
        var articles = await articleRepository.GetPublishedPublicArticlesAsync(cancellationToken);
        var response = new PublicSearchIndexResponse(
            DateTimeOffset.UtcNow,
            articles.Select(PublicArticleSearchDocument.FromDomain).ToArray());

        return Result<PublicSearchIndexResponse>.Success(response);
    }
}

public sealed record PublicArticleListItem(
    string Id,
    string Slug,
    string Title,
    string Summary,
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
            article.Category.DisplayName,
            article.Tags.Select(tag => tag.DisplayName).ToArray(),
            article.Body.Value,
            $"/workspace/articles/{article.Id.Value:D}",
            article.UpdatedAt,
            article.PublishedAt);
    }
}
