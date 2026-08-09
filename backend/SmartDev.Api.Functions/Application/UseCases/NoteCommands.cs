using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed record CreateNoteCommand(
    string Title,
    string Slug,
    string Summary,
    CreateNoteCategory Category,
    IReadOnlyCollection<CreateNoteTag> Tags,
    string BodyMarkdown,
    NoteStatus Status,
    NoteVisibility Visibility);

public sealed record CreateNoteCategory(string Slug, string DisplayName);

public sealed record CreateNoteTag(string Slug, string DisplayName);

public sealed record CreateNoteResult(Guid NoteId, string Slug);

public sealed record UpdateNoteCommand(
    Guid NoteId,
    string Title,
    string Slug,
    string Summary,
    CreateNoteCategory Category,
    IReadOnlyCollection<CreateNoteTag> Tags,
    string BodyMarkdown,
    NoteStatus Status,
    NoteVisibility Visibility);

public sealed record UpdateNoteResult(Guid NoteId, string Slug);

public sealed class CreateNoteHandler(INoteRepository noteRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<CreateNoteResult> HandleAsync(CreateNoteCommand command, CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;
        var note = Note.CreateDraft(
            NoteId.New(),
            NoteTitle.Create(command.Title),
            NoteSlug.Create(command.Slug),
            NoteSummary.Create(command.Summary),
            NoteCategorySnapshot.Create(NoteCategorySlug.Create(command.Category.Slug), command.Category.DisplayName),
            MarkdownContent.Create(command.BodyMarkdown),
            command.Tags.Select(tag => NoteTagSnapshot.Create(NoteTagSlug.Create(tag.Slug), tag.DisplayName)),
            relatedProjects: [],
            now);

        note.ChangePublication(command.Status, command.Visibility, now);

        await noteRepository.AddAsync(note, cancellationToken);
        await domainEventDispatcher.DispatchAsync(note.DomainEvents, cancellationToken);
        note.ClearDomainEvents();

        return new CreateNoteResult(note.Id.Value, note.Slug.Value);
    }
}

public sealed class UpdateNoteHandler(INoteRepository noteRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<UpdateNoteResult> HandleAsync(UpdateNoteCommand command, CancellationToken cancellationToken)
    {
        var note = await noteRepository.GetByIdAsync(NoteId.From(command.NoteId), cancellationToken);
        if (note is null) throw new KeyNotFoundException($"Note {command.NoteId:D} was not found.");

        var now = DateTimeOffset.UtcNow;
        note.Rename(NoteTitle.Create(command.Title), NoteSlug.Create(command.Slug), now);
        note.UpdateSummary(NoteSummary.Create(command.Summary), now);
        note.ChangeCategory(NoteCategorySnapshot.Create(NoteCategorySlug.Create(command.Category.Slug), command.Category.DisplayName), now);
        note.ReplaceTags(command.Tags.Select(tag => NoteTagSnapshot.Create(NoteTagSlug.Create(tag.Slug), tag.DisplayName)), now);
        note.UpdateBody(MarkdownContent.Create(command.BodyMarkdown), now);
        note.ChangePublication(command.Status, command.Visibility, now);

        await noteRepository.SaveAsync(note, cancellationToken);
        await domainEventDispatcher.DispatchAsync(note.DomainEvents, cancellationToken);
        note.ClearDomainEvents();

        return new UpdateNoteResult(note.Id.Value, note.Slug.Value);
    }
}
