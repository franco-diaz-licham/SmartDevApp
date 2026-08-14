namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Describes the publication lifecycle state of a note.
/// </summary>
public enum NoteStatus
{
    /// <summary>
    /// The note is editable and not intended for public presentation.
    /// </summary>
    Draft,

    /// <summary>
    /// The note is published and may be visible to readers.
    /// </summary>
    Published,

    /// <summary>
    /// The note has been retired from the active note catalog.
    /// </summary>
    Archived
}
