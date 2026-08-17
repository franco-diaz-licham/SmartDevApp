using System.Text.RegularExpressions;
using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Represents the human-readable article title displayed in lists and detail pages.
/// </summary>
public sealed record ArticleTitle
{
    private const int MaxLength = 160;

    private ArticleTitle(string value) => Value = value;

    /// <summary>
    /// Gets the trimmed title text.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated article title.
    /// </summary>
    public static ArticleTitle Create(string value) => new(Guard.Required(value, "title", MaxLength));

    public override string ToString() => Value;
}

/// <summary>
/// Represents the URL-safe public identifier used to route to an article.
/// </summary>
/// <remarks>
/// Slugs are normalized to lowercase and may contain lowercase letters, numbers, and single hyphens between segments.
/// </remarks>
public sealed record ArticleSlug
{
    private const int MaxLength = 120;
    private static readonly Regex SlugExpression = new("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);

    private ArticleSlug(string value) => Value = value;

    /// <summary>
    /// Gets the normalized URL-safe slug.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated, lowercase article slug.
    /// </summary>
    public static ArticleSlug Create(string value)
    {
        var slug = Guard.Required(value, "slug", MaxLength).ToLowerInvariant();
        if (!SlugExpression.IsMatch(slug)) throw new ArgumentException("slug must be URL-safe and use lowercase letters, numbers, and hyphens.", "slug");
        return new ArticleSlug(slug);
    }

    public override string ToString() => Value;
}

/// <summary>
/// Represents the short article preview shown in lists, cards, and search results.
/// </summary>
public sealed record ArticleSummary
{
    private const int MaxLength = 500;

    private ArticleSummary(string value) => Value = value;

    /// <summary>
    /// Gets the trimmed summary text.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated article summary.
    /// </summary>
    public static ArticleSummary Create(string value) => new(Guard.Required(value, "summary", MaxLength));

    public override string ToString() => Value;
}

/// <summary>
/// Represents the canonical slug for a managed article category.
/// </summary>
public sealed record ArticleCategorySlug
{
    private const int MaxLength = 80;
    private static readonly Regex SlugExpression = new("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);

    private ArticleCategorySlug(string value) => Value = value;

    /// <summary>
    /// Gets the normalized category slug.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated, lowercase category slug.
    /// </summary>
    public static ArticleCategorySlug Create(string value)
    {
        var slug = Guard.Required(value, "categorySlug", MaxLength).ToLowerInvariant();
        if (!SlugExpression.IsMatch(slug)) throw new ArgumentException("categorySlug must be URL-safe and use lowercase letters, numbers, and hyphens.", "categorySlug");
        return new ArticleCategorySlug(slug);
    }

    public override string ToString() => Value;
}

/// <summary>
/// Stores the category data an article needs to render without a catalog lookup.
/// </summary>
public sealed record ArticleCategorySnapshot
{
    private const int MaxDisplayNameLength = 80;

    private ArticleCategorySnapshot(ArticleCategorySlug slug, string displayName)
    {
        Slug = slug;
        DisplayName = displayName;
    }

    /// <summary>
    /// Gets the canonical category slug.
    /// </summary>
    public ArticleCategorySlug Slug { get; }

    /// <summary>
    /// Gets the category display name captured when the article was saved.
    /// </summary>
    public string DisplayName { get; }

    /// <summary>
    /// Creates a category snapshot for storage on an article.
    /// </summary>
    public static ArticleCategorySnapshot Create(ArticleCategorySlug slug, string displayName)
    {
        return new ArticleCategorySnapshot(slug, Guard.Required(displayName, "categoryDisplayName", MaxDisplayNameLength));
    }
}

/// <summary>
/// Represents the editable Markdown body of an article.
/// </summary>
public sealed record MarkdownContent
{
    /// <summary>
    /// Gets the maximum allowed Markdown body length.
    /// </summary>
    public const int MaxLength = 50_000;

    private MarkdownContent(string value) => Value = value;

    /// <summary>
    /// Gets the trimmed Markdown body.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates validated Markdown content.
    /// </summary>
    public static MarkdownContent Create(string value) => new(Guard.Required(value, "bodyMarkdown", MaxLength));

    public override string ToString() => Value;
}

/// <summary>
/// Represents the canonical slug for a managed article tag.
/// </summary>
public sealed record ArticleTagSlug
{
    private const int MaxLength = 80;
    private static readonly Regex SlugExpression = new("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);

    private ArticleTagSlug(string value) => Value = value;

    /// <summary>
    /// Gets the normalized canonical tag slug.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated, lowercase tag slug.
    /// </summary>
    public static ArticleTagSlug Create(string value)
    {
        var normalized = Guard.Required(value, "tagSlug", MaxLength).ToLowerInvariant();
        if (!SlugExpression.IsMatch(normalized)) throw new ArgumentException("tagSlug must be URL-safe and use lowercase letters, numbers, and hyphens.", "tagSlug");
        return new ArticleTagSlug(normalized);
    }

    public override string ToString() => Value;
}

/// <summary>
/// Stores the tag data an article needs to render without a catalog lookup.
/// </summary>
public sealed record ArticleTagSnapshot
{
    private const int MaxDisplayNameLength = 80;

    private ArticleTagSnapshot(ArticleTagSlug slug, string displayName)
    {
        Slug = slug;
        DisplayName = displayName;
    }

    /// <summary>
    /// Gets the canonical tag slug.
    /// </summary>
    public ArticleTagSlug Slug { get; }

    /// <summary>
    /// Gets the tag display name captured when the article was saved.
    /// </summary>
    public string DisplayName { get; }

    /// <summary>
    /// Creates a tag snapshot for storage on an article.
    /// </summary>
    public static ArticleTagSnapshot Create(ArticleTagSlug slug, string displayName)
    {
        return new ArticleTagSnapshot(slug, Guard.Required(displayName, "tagDisplayName", MaxDisplayNameLength));
    }
}

/// <summary>
/// References a portfolio project related to an article.
/// </summary>
public sealed record RelatedProjectReference
{
    private const int MaxIdLength = 120;
    private const int MaxLabelLength = 160;

    private RelatedProjectReference(string projectId, string label)
    {
        ProjectId = projectId;
        Label = label;
    }

    /// <summary>
    /// Gets the stable related project identifier.
    /// </summary>
    public string ProjectId { get; }

    /// <summary>
    /// Gets the display label for the related project.
    /// </summary>
    public string Label { get; }

    /// <summary>
    /// Creates a validated related project reference.
    /// </summary>
    public static RelatedProjectReference Create(string projectId, string label)
    {
        return new RelatedProjectReference(
            Guard.Required(projectId, "projectId", MaxIdLength),
            Guard.Required(label, "label", MaxLabelLength));
    }
}
