using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

public sealed record NoteCreated(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record NoteUpdated(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record NotePublished(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record NoteArchived(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;
