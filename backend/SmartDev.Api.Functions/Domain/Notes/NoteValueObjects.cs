using System.Text.RegularExpressions;
using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Represents the human-readable note title displayed in lists and detail pages.
/// </summary>
public sealed record NoteTitle
{
    private const int MaxLength = 160;

    private NoteTitle(string value) => Value = value;

    /// <summary>
    /// Gets the trimmed title text.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated note title.
    /// </summary>
    public static NoteTitle Create(string value) => new(Guard.Required(value, "title", MaxLength));

    public override string ToString() => Value;
}

/// <summary>
/// Represents the URL-safe public identifier used to route to a note.
/// </summary>
/// <remarks>
/// Slugs are normalized to lowercase and may contain lowercase letters, numbers, and single hyphens between segments.
/// </remarks>
public sealed record NoteSlug
{
    private const int MaxLength = 120;
    private static readonly Regex SlugExpression = new("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);

    private NoteSlug(string value) => Value = value;

    /// <summary>
    /// Gets the normalized URL-safe slug.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated, lowercase note slug.
    /// </summary>
    public static NoteSlug Create(string value)
    {
        var slug = Guard.Required(value, "slug", MaxLength).ToLowerInvariant();
        if (!SlugExpression.IsMatch(slug)) throw new ArgumentException("slug must be URL-safe and use lowercase letters, numbers, and hyphens.", "slug");
        return new NoteSlug(slug);
    }

    public override string ToString() => Value;
}

/// <summary>
/// Represents the short note preview shown in lists, cards, and search results.
/// </summary>
public sealed record NoteSummary
{
    private const int MaxLength = 500;

    private NoteSummary(string value) => Value = value;

    /// <summary>
    /// Gets the trimmed summary text.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated note summary.
    /// </summary>
    public static NoteSummary Create(string value) => new(Guard.Required(value, "summary", MaxLength));

    public override string ToString() => Value;
}

/// <summary>
/// Represents the canonical slug for a managed note category.
/// </summary>
public sealed record NoteCategorySlug
{
    private const int MaxLength = 80;
    private static readonly Regex SlugExpression = new("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);

    private NoteCategorySlug(string value) => Value = value;

    /// <summary>
    /// Gets the normalized category slug.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated, lowercase category slug.
    /// </summary>
    public static NoteCategorySlug Create(string value)
    {
        var slug = Guard.Required(value, "categorySlug", MaxLength).ToLowerInvariant();
        if (!SlugExpression.IsMatch(slug)) throw new ArgumentException("categorySlug must be URL-safe and use lowercase letters, numbers, and hyphens.", "categorySlug");
        return new NoteCategorySlug(slug);
    }

    public override string ToString() => Value;
}

/// <summary>
/// Stores the category data a note needs to render without a catalog lookup.
/// </summary>
public sealed record NoteCategorySnapshot
{
    private const int MaxDisplayNameLength = 80;

    private NoteCategorySnapshot(NoteCategorySlug slug, string displayName)
    {
        Slug = slug;
        DisplayName = displayName;
    }

    /// <summary>
    /// Gets the canonical category slug.
    /// </summary>
    public NoteCategorySlug Slug { get; }

    /// <summary>
    /// Gets the category display name captured when the note was saved.
    /// </summary>
    public string DisplayName { get; }

    /// <summary>
    /// Creates a category snapshot for storage on a note.
    /// </summary>
    public static NoteCategorySnapshot Create(NoteCategorySlug slug, string displayName)
    {
        return new NoteCategorySnapshot(slug, Guard.Required(displayName, "categoryDisplayName", MaxDisplayNameLength));
    }
}

/// <summary>
/// Represents the editable Markdown body of a note.
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
/// Represents the canonical slug for a managed note tag.
/// </summary>
public sealed record NoteTagSlug
{
    private const int MaxLength = 80;
    private static readonly Regex SlugExpression = new("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);

    private NoteTagSlug(string value) => Value = value;

    /// <summary>
    /// Gets the normalized canonical tag slug.
    /// </summary>
    public string Value { get; }

    /// <summary>
    /// Creates a validated, lowercase tag slug.
    /// </summary>
    public static NoteTagSlug Create(string value)
    {
        var normalized = Guard.Required(value, "tagSlug", MaxLength).ToLowerInvariant();
        if (!SlugExpression.IsMatch(normalized)) throw new ArgumentException("tagSlug must be URL-safe and use lowercase letters, numbers, and hyphens.", "tagSlug");
        return new NoteTagSlug(normalized);
    }

    public override string ToString() => Value;
}

/// <summary>
/// Stores the tag data a note needs to render without a catalog lookup.
/// </summary>
public sealed record NoteTagSnapshot
{
    private const int MaxDisplayNameLength = 80;

    private NoteTagSnapshot(NoteTagSlug slug, string displayName)
    {
        Slug = slug;
        DisplayName = displayName;
    }

    /// <summary>
    /// Gets the canonical tag slug.
    /// </summary>
    public NoteTagSlug Slug { get; }

    /// <summary>
    /// Gets the tag display name captured when the note was saved.
    /// </summary>
    public string DisplayName { get; }

    /// <summary>
    /// Creates a tag snapshot for storage on a note.
    /// </summary>
    public static NoteTagSnapshot Create(NoteTagSlug slug, string displayName)
    {
        return new NoteTagSnapshot(slug, Guard.Required(displayName, "tagDisplayName", MaxDisplayNameLength));
    }
}

/// <summary>
/// References a portfolio project related to a note.
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
