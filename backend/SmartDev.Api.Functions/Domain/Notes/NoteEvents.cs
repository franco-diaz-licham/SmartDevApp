using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Raised when a note draft is created.
/// </summary>
/// <param name="NoteId">The created note identifier.</param>
/// <param name="OccurredAt">The time the note was created.</param>
public sealed record NoteCreatedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

/// <summary>
/// Raised when editable note content, metadata, or links change.
/// </summary>
/// <param name="NoteId">The updated note identifier.</param>
/// <param name="OccurredAt">The time the note was updated.</param>
public sealed record NoteUpdatedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

/// <summary>
/// Raised when a note enters the published lifecycle state.
/// </summary>
/// <param name="NoteId">The published note identifier.</param>
/// <param name="OccurredAt">The time the note was published.</param>
public sealed record NotePublishedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

/// <summary>
/// Raised when a note enters the archived lifecycle state.
/// </summary>
/// <param name="NoteId">The archived note identifier.</param>
/// <param name="OccurredAt">The time the note was archived.</param>
public sealed record NoteArchivedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;
