using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Defines a managed tag that articles can reference through snapshots.
/// </summary>
public sealed class ArticleTag : Entity<ArticleTagSlug>
{
    private ArticleTag(ArticleTagSlug id, string displayName, IReadOnlyCollection<string> aliases, bool isActive) : base(id)
    {
        DisplayName = displayName;
        Aliases = aliases;
        IsActive = isActive;
    }

    /// <summary>
    /// Gets the tag display name shown to readers and editors.
    /// </summary>
    public string DisplayName { get; private set; }

    /// <summary>
    /// Gets normalized aliases that resolve to this canonical tag.
    /// </summary>
    public IReadOnlyCollection<string> Aliases { get; private set; }

    /// <summary>
    /// Gets whether the tag can be assigned to articles.
    /// </summary>
    public bool IsActive { get; private set; }

    /// <summary>
    /// Gets the snapshot copied onto articles that reference this tag.
    /// </summary>
    public ArticleTagSnapshot Snapshot => ArticleTagSnapshot.Create(Id, DisplayName);

    /// <summary>
    /// Creates an active article tag with optional aliases.
    /// </summary>
    public static ArticleTag Create(ArticleTagSlug slug, string displayName, IEnumerable<string>? aliases = null)
    {
        return new ArticleTag(
            slug,
            Guard.Required(displayName, "tagDisplayName", 80),
            NormalizeAliases(aliases ?? []),
            isActive: true);
    }

    private static IReadOnlyCollection<string> NormalizeAliases(IEnumerable<string> aliases)
    {
        return aliases
            .Where(alias => !string.IsNullOrWhiteSpace(alias))
            .Select(alias => alias.Trim().ToLowerInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }
}
