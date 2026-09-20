namespace SmartDev.Api.Functions.Features.Journal.Domain;

/// <summary>
/// Stable identifier for a journal entry.
/// </summary>
public readonly record struct JournalEntryId(Guid Value)
{
    /// <summary>
    /// Creates a new journal entry identifier.
    /// </summary>
    public static JournalEntryId New() => new(Guid.NewGuid());

    /// <summary>
    /// Creates an identifier from an existing GUID.
    /// </summary>
    public static JournalEntryId From(Guid value) => new(value);
}
