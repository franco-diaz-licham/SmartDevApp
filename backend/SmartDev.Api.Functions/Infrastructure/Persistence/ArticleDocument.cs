using Newtonsoft.Json;
using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class ArticleDocument
{
    public const string ContainerName = "articles";
    public const string DocumentType = "article";
    public const string PartitionKeyPath = "/visibility";
    public const string PublicPartitionKey = "Public";
    public const string PrivatePartitionKey = "Private";

    [JsonProperty("id")]
    public string Id { get; init; } = string.Empty;

    public string Type { get; init; } = DocumentType;

    public string Slug { get; init; } = string.Empty;

    public string Title { get; init; } = string.Empty;

    public string Summary { get; init; } = string.Empty;

    public string ArticleType { get; init; } = global::SmartDev.Api.Functions.Domain.Articles.ArticleType.DeepDive.ToString();

    public ArticleCategoryDocument Category { get; init; } = new(string.Empty, string.Empty);

    public IReadOnlyCollection<ArticleTagDocument> Tags { get; init; } = [];

    public string BodyMarkdown { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string Visibility { get; init; } = string.Empty;

    public IReadOnlyCollection<RelatedProjectDocument> RelatedProjects { get; init; } = [];

    public DateTimeOffset CreatedAt { get; init; }

    public DateTimeOffset? UpdatedAt { get; init; }

    public DateTimeOffset? PublishedAt { get; init; }

    public DateTimeOffset? ArchivedAt { get; init; }

    public static ArticleDocument FromDomain(Article article)
    {
        return new ArticleDocument {
            Id = article.Id.Value.ToString("D"),
            Slug = article.Slug.Value,
            Title = article.Title.Value,
            Summary = article.Summary.Value,
            ArticleType = article.ArticleType.ToString(),
            Category = new ArticleCategoryDocument(article.Category.Slug.Value, article.Category.DisplayName),
            Tags = article.Tags.Select(tag => new ArticleTagDocument(tag.Slug.Value, tag.DisplayName)).ToArray(),
            BodyMarkdown = article.Body.Value,
            Status = article.Status.ToString(),
            Visibility = article.Visibility.ToString(),
            RelatedProjects = article.RelatedProjects
                .Select(project => new RelatedProjectDocument(project.ProjectId, project.Label))
                .ToArray(),
            CreatedAt = article.CreatedAt,
            UpdatedAt = article.UpdatedAt,
            PublishedAt = article.PublishedAt,
            ArchivedAt = article.ArchivedAt
        };
    }

    public Article ToDomain()
    {
        return Article.Hydrate(
            ArticleId.From(Guid.Parse(Id)),
            ArticleTitle.Create(Title),
            ArticleSlug.Create(Slug),
            ArticleSummary.Create(Summary),
            ResolveArticleType(ArticleType),
            ArticleCategorySnapshot.Create(ArticleCategorySlug.Create(Category.Slug), Category.DisplayName),
            MarkdownContent.Create(BodyMarkdown),
            Enum.Parse<ArticleStatus>(Status),
            Enum.Parse<ArticleVisibility>(Visibility),
            Tags.Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag.Slug), tag.DisplayName)),
            RelatedProjects.Select(project => RelatedProjectReference.Create(project.ProjectId, project.Label)),
            CreatedAt,
            UpdatedAt,
            PublishedAt,
            ArchivedAt);
    }

    public string PartitionKey => Visibility;

    private static global::SmartDev.Api.Functions.Domain.Articles.ArticleType ResolveArticleType(string? articleType)
    {
        if (string.Equals(articleType, "DecisionRecord", StringComparison.OrdinalIgnoreCase)) return global::SmartDev.Api.Functions.Domain.Articles.ArticleType.ProjectWriteup;
        if (string.Equals(articleType, "WeeklyReflection", StringComparison.OrdinalIgnoreCase)) return global::SmartDev.Api.Functions.Domain.Articles.ArticleType.Reflection;

        return Enum.TryParse<global::SmartDev.Api.Functions.Domain.Articles.ArticleType>(articleType, ignoreCase: true, out var parsedArticleType) && Enum.IsDefined(parsedArticleType)
            ? parsedArticleType
            : global::SmartDev.Api.Functions.Domain.Articles.ArticleType.DeepDive;
    }
}

public sealed record RelatedProjectDocument(string ProjectId, string Label);

public sealed record ArticleCategoryDocument(string Slug, string DisplayName);

public sealed record ArticleTagDocument(string Slug, string DisplayName);
