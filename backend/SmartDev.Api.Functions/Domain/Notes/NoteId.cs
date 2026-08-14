namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Identifies a note aggregate with a stable generated identifier.
/// </summary>
/// <param name="Value">The underlying note identifier.</param>
public readonly record struct NoteId(Guid Value)
{
    /// <summary>
    /// Creates a new note identifier.
    /// </summary>
    public static NoteId New() => new(Guid.NewGuid());

    /// <summary>
    /// Creates a note identifier from a persisted GUID value.
    /// </summary>
    public static NoteId From(Guid value)
    {
        if (value == Guid.Empty) throw new ArgumentException("Note id is required.", nameof(value));
        return new NoteId(value);
    }
}
