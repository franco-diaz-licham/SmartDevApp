namespace SmartDev.Api.Functions.Domain.Contact;

/// <summary>
/// Identifies a submitted contact message.
/// </summary>
/// <param name="Value">The underlying contact message identifier.</param>
public readonly record struct ContactMessageId(Guid Value)
{
    /// <summary>
    /// Creates a new contact message identifier.
    /// </summary>
    public static ContactMessageId New() => new(Guid.NewGuid());

    /// <summary>
    /// Returns the identifier in canonical GUID format.
    /// </summary>
    public override string ToString() => Value.ToString("D");
}
