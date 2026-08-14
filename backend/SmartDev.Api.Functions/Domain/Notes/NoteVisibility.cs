namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Describes whether a note can be shown outside administrative experiences.
/// </summary>
public enum NoteVisibility
{
    /// <summary>
    /// The note is restricted to administrative or authoring flows.
    /// </summary>
    Private,

    /// <summary>
    /// The note may be shown in public reader experiences.
    /// </summary>
    Public
}
