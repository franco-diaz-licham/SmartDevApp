using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Defines a managed category that notes can reference through snapshots.
/// </summary>
public sealed class NoteCategory : Entity<NoteCategorySlug>
{
    private NoteCategory(NoteCategorySlug id, string displayName, string? description, int sortOrder, bool isActive) : base(id)
    {
        DisplayName = displayName;
        Description = description;
        SortOrder = sortOrder;
        IsActive = isActive;
    }

    /// <summary>
    /// Gets the category display name shown to readers and editors.
    /// </summary>
    public string DisplayName { get; private set; }

    /// <summary>
    /// Gets the optional category description.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Gets the category sort order used by browse and editor experiences.
    /// </summary>
    public int SortOrder { get; private set; }

    /// <summary>
    /// Gets whether the category can be assigned to notes.
    /// </summary>
    public bool IsActive { get; private set; }

    /// <summary>
    /// Gets the snapshot copied onto notes that reference this category.
    /// </summary>
    public NoteCategorySnapshot Snapshot => NoteCategorySnapshot.Create(Id, DisplayName);

    /// <summary>
    /// Creates an active note category.
    /// </summary>
    public static NoteCategory Create(NoteCategorySlug slug, string displayName, string? description = null, int sortOrder = 0)
    {
        return new NoteCategory(
            slug,
            Guard.Required(displayName, "categoryDisplayName", 80),
            Guard.Optional(description, "categoryDescription", 500),
            sortOrder,
            isActive: true);
    }
}
