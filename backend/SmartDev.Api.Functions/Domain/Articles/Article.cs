using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Represents an authored article aggregate with content, catalog metadata, and publication state.
/// </summary>
public sealed class Article : Entity<ArticleId>
{
    private readonly List<ArticleTagSnapshot> _tags = [];
    private readonly List<RelatedProjectReference> _relatedProjects = [];

    private Article(
        ArticleId id,
        ArticleTitle title,
        ArticleSlug slug,
        ArticleSummary summary,
        ArticleCategorySnapshot category,
        MarkdownContent body,
        ArticleStatus status,
        ArticleVisibility visibility,
        IEnumerable<ArticleTagSnapshot> tags,
        IEnumerable<RelatedProjectReference> relatedProjects,
        DateTimeOffset? updatedAt,
        DateTimeOffset? publishedAt,
        DateTimeOffset? archivedAt) : base(id)
    {
        Title = title;
        Slug = slug;
        Summary = summary;
        Category = category;
        Body = body;
        Status = status;
        Visibility = visibility;
        _tags.AddRange(NormalizeTags(tags));
        _relatedProjects.AddRange(relatedProjects.DistinctBy(project => project.ProjectId));
        PublishedAt = publishedAt;
        ArchivedAt = archivedAt;
        if (updatedAt is not null) Touch(updatedAt.Value);
    }

    private Article(
        ArticleId id,
        ArticleTitle title,
        ArticleSlug slug,
        ArticleSummary summary,
        ArticleCategorySnapshot category,
        MarkdownContent body,
        ArticleStatus status,
        ArticleVisibility visibility,
        IEnumerable<ArticleTagSnapshot> tags,
        IEnumerable<RelatedProjectReference> relatedProjects,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? publishedAt,
        DateTimeOffset? archivedAt) : base(id, createdAt, updatedAt)
    {
        Title = title;
        Slug = slug;
        Summary = summary;
        Category = category;
        Body = body;
        Status = status;
        Visibility = visibility;
        _tags.AddRange(NormalizeTags(tags));
        _relatedProjects.AddRange(relatedProjects.DistinctBy(project => project.ProjectId));
        PublishedAt = publishedAt;
        ArchivedAt = archivedAt;
    }

    /// <summary>
    /// Gets the human-readable article title.
    /// </summary>
    public ArticleTitle Title { get; private set; }

    /// <summary>
    /// Gets the URL-safe slug used to route to the article.
    /// </summary>
    public ArticleSlug Slug { get; private set; }

    /// <summary>
    /// Gets the short article summary used in lists and search results.
    /// </summary>
    public ArticleSummary Summary { get; private set; }

    /// <summary>
    /// Gets the broad category assigned to the article.
    /// </summary>
    public ArticleCategorySnapshot Category { get; private set; }

    /// <summary>
    /// Gets the Markdown body content for the article.
    /// </summary>
    public MarkdownContent Body { get; private set; }

    /// <summary>
    /// Gets the article publication lifecycle status.
    /// </summary>
    public ArticleStatus Status { get; private set; }

    /// <summary>
    /// Gets whether the article is public or private.
    /// </summary>
    public ArticleVisibility Visibility { get; private set; }

    /// <summary>
    /// Gets the resolved tag snapshots attached to the article.
    /// </summary>
    public IReadOnlyCollection<ArticleTagSnapshot> Tags => _tags;

    /// <summary>
    /// Gets the portfolio projects related to the article.
    /// </summary>
    public IReadOnlyCollection<RelatedProjectReference> RelatedProjects => _relatedProjects;

    /// <summary>
    /// Gets when the article was published, when it has been published.
    /// </summary>
    public DateTimeOffset? PublishedAt { get; private set; }

    /// <summary>
    /// Gets when the article was archived, when it has been archived.
    /// </summary>
    public DateTimeOffset? ArchivedAt { get; private set; }

    /// <summary>
    /// Gets the combined article text used for simple search matching.
    /// </summary>
    public string SearchableText => string.Join(
        " ",
        Title.Value,
        Summary.Value,
        Category.Slug.Value,
        Category.DisplayName,
        string.Join(" ", Tags.Select(tag => $"{tag.Slug.Value} {tag.DisplayName}")),
        string.Join(" ", RelatedProjects.Select(project => project.Label)),
        Body.Value);

    /// <summary>
    /// Creates a private draft article and raises a creation event.
    /// </summary>
    public static Article CreateDraft(
        ArticleId id,
        ArticleTitle title,
        ArticleSlug slug,
        ArticleSummary summary,
        ArticleCategorySnapshot category,
        MarkdownContent body,
        IEnumerable<ArticleTagSnapshot> tags,
        IEnumerable<RelatedProjectReference>? relatedProjects,
        DateTimeOffset? now = null)
    {
        var occurredAt = now ?? DateTimeOffset.UtcNow;
        var article = new Article(
            id,
            title,
            slug,
            summary,
            category,
            body,
            ArticleStatus.Draft,
            ArticleVisibility.Private,
            tags,
            relatedProjects ?? [],
            updatedAt: null,
            publishedAt: null,
            archivedAt: null);

        article.RaiseDomainEvent(new ArticleCreatedEvent(id, occurredAt));
        return article;
    }

    /// <summary>
    /// Rehydrates an article aggregate from persisted state without raising domain events.
    /// </summary>
    public static Article Hydrate(
        ArticleId id,
        ArticleTitle title,
        ArticleSlug slug,
        ArticleSummary summary,
        ArticleCategorySnapshot category,
        MarkdownContent body,
        ArticleStatus status,
        ArticleVisibility visibility,
        IEnumerable<ArticleTagSnapshot> tags,
        IEnumerable<RelatedProjectReference> relatedProjects,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? publishedAt,
        DateTimeOffset? archivedAt)
    {
        return new Article(id, title, slug, summary, category, body, status, visibility, tags, relatedProjects, createdAt, updatedAt, publishedAt, archivedAt);
    }

    /// <summary>
    /// Changes the article title and route slug.
    /// </summary>
    public void Rename(ArticleTitle title, ArticleSlug slug, DateTimeOffset now)
    {
        Title = title;
        Slug = slug;
        MarkUpdated(now);
    }

    /// <summary>
    /// Replaces the short summary used in article previews.
    /// </summary>
    public void UpdateSummary(ArticleSummary summary, DateTimeOffset now)
    {
        Summary = summary;
        MarkUpdated(now);
    }

    /// <summary>
    /// Replaces the Markdown body content.
    /// </summary>
    public void UpdateBody(MarkdownContent body, DateTimeOffset now)
    {
        Body = body;
        MarkUpdated(now);
    }

    /// <summary>
    /// Changes the article category snapshot.
    /// </summary>
    public void ChangeCategory(ArticleCategorySnapshot category, DateTimeOffset now)
    {
        Category = category;
        MarkUpdated(now);
    }

    /// <summary>
    /// Replaces the article tag snapshots with a normalized non-empty set.
    /// </summary>
    public void ReplaceTags(IEnumerable<ArticleTagSnapshot> tags, DateTimeOffset now)
    {
        _tags.Clear();
        _tags.AddRange(NormalizeTags(tags));
        MarkUpdated(now);
    }

    /// <summary>
    /// Links a related portfolio project when it is not already linked.
    /// </summary>
    public void LinkProject(RelatedProjectReference project, DateTimeOffset now)
    {
        if (_relatedProjects.Any(existing => string.Equals(existing.ProjectId, project.ProjectId, StringComparison.OrdinalIgnoreCase))) return;
        _relatedProjects.Add(project);
        MarkUpdated(now);
    }

    /// <summary>
    /// Removes a related portfolio project link.
    /// </summary>
    public void UnlinkProject(RelatedProjectReference project, DateTimeOffset now)
    {
        _relatedProjects.RemoveAll(existing => string.Equals(existing.ProjectId, project.ProjectId, StringComparison.OrdinalIgnoreCase));
        MarkUpdated(now);
    }

    /// <summary>
    /// Publishes the article and makes it publicly visible.
    /// </summary>
    public void Publish(DateTimeOffset now)
    {
        Status = ArticleStatus.Published;
        Visibility = ArticleVisibility.Public;
        PublishedAt ??= now;
        ArchivedAt = null;
        MarkUpdated(now);
        RaiseDomainEvent(new ArticlePublishedEvent(Id, now));
    }

    /// <summary>
    /// Changes the article lifecycle state and visibility together.
    /// </summary>
    public void ChangePublication(ArticleStatus status, ArticleVisibility visibility, DateTimeOffset now)
    {
        if (Status == status && Visibility == visibility) return;

        var previousStatus = Status;
        Status = status;
        Visibility = visibility;

        if (Status == ArticleStatus.Published && PublishedAt is null) {
            PublishedAt = now;
        }

        if (Status == ArticleStatus.Archived) {
            ArchivedAt ??= now;
        } else {
            ArchivedAt = null;
        }

        if (Status == ArticleStatus.Draft) {
            PublishedAt = null;
        }

        MarkUpdated(now);

        if (previousStatus != ArticleStatus.Published && Status == ArticleStatus.Published) {
            RaiseDomainEvent(new ArticlePublishedEvent(Id, now));
        }

        if (previousStatus != ArticleStatus.Archived && Status == ArticleStatus.Archived) {
            RaiseDomainEvent(new ArticleArchivedEvent(Id, now));
        }
    }

    /// <summary>
    /// Restricts the article from public reader experiences.
    /// </summary>
    public void MakePrivate(DateTimeOffset now)
    {
        Visibility = ArticleVisibility.Private;
        MarkUpdated(now);
    }

    /// <summary>
    /// Allows the article to appear in public reader experiences.
    /// </summary>
    public void MakePublic(DateTimeOffset now)
    {
        Visibility = ArticleVisibility.Public;
        MarkUpdated(now);
    }

    /// <summary>
    /// Archives the article and raises an archival event.
    /// </summary>
    public void Archive(DateTimeOffset now)
    {
        Status = ArticleStatus.Archived;
        ArchivedAt = now;
        MarkUpdated(now);
        RaiseDomainEvent(new ArticleArchivedEvent(Id, now));
    }

    private void MarkUpdated(DateTimeOffset now)
    {
        Touch(now);
        RaiseDomainEvent(new ArticleUpdatedEvent(Id, now));
    }

    private static List<ArticleTagSnapshot> NormalizeTags(IEnumerable<ArticleTagSnapshot> tags)
    {
        var normalized = tags.DistinctBy(tag => tag.Slug.Value).ToList();
        if (normalized.Count == 0) throw new ArgumentException("tags must contain at least one item.", "tags");
        return normalized;
    }
}
