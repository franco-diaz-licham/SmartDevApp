using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Defines a managed tag that notes can reference through snapshots.
/// </summary>
public sealed class NoteTag : Entity<NoteTagSlug>
{
    private NoteTag(NoteTagSlug id, string displayName, IReadOnlyCollection<string> aliases, bool isActive) : base(id)
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
    /// Gets whether the tag can be assigned to notes.
    /// </summary>
    public bool IsActive { get; private set; }

    /// <summary>
    /// Gets the snapshot copied onto notes that reference this tag.
    /// </summary>
    public NoteTagSnapshot Snapshot => NoteTagSnapshot.Create(Id, DisplayName);

    /// <summary>
    /// Creates an active note tag with optional aliases.
    /// </summary>
    public static NoteTag Create(NoteTagSlug slug, string displayName, IEnumerable<string>? aliases = null)
    {
        return new NoteTag(
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
