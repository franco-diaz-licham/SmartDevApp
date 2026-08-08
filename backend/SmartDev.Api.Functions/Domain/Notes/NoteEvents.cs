using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

public sealed record NoteCreatedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record NoteUpdatedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record NotePublishedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;

public sealed record NoteArchivedEvent(NoteId NoteId, DateTimeOffset OccurredAt) : IDomainEvent;
