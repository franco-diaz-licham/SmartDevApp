namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Identifies a note aggregate with a stable generated identifier.
/// </summary>
/// <param name="Value">The underlying note identifier.</param>
public readonly record struct NoteId(Guid Value)
{
    public static NoteId New() => new(Guid.NewGuid());

    public static NoteId From(Guid value)
    {
        if (value == Guid.Empty) throw new ArgumentException("Note id is required.", nameof(value));
        return new NoteId(value);
    }
}
