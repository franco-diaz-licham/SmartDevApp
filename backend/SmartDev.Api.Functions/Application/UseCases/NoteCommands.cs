using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed record CreateNoteCommand(
    string Title,
    string Slug,
    string Summary,
    CreateNoteCategory Category,
    IReadOnlyCollection<CreateNoteTag> Tags,
    string BodyMarkdown);

public sealed record CreateNoteCategory(string Slug, string DisplayName);

public sealed record CreateNoteTag(string Slug, string DisplayName);

public sealed record CreateNoteResult(Guid NoteId, string Slug);

public sealed class CreateNoteHandler(INoteRepository noteRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<CreateNoteResult> HandleAsync(CreateNoteCommand command, CancellationToken cancellationToken)
    {
        var note = Note.CreateDraft(
            NoteId.New(),
            NoteTitle.Create(command.Title),
            NoteSlug.Create(command.Slug),
            NoteSummary.Create(command.Summary),
            NoteCategorySnapshot.Create(NoteCategorySlug.Create(command.Category.Slug), command.Category.DisplayName),
            MarkdownContent.Create(command.BodyMarkdown),
            command.Tags.Select(tag => NoteTagSnapshot.Create(NoteTagSlug.Create(tag.Slug), tag.DisplayName)),
            relatedProjects: []);

        await noteRepository.AddAsync(note, cancellationToken);
        await domainEventDispatcher.DispatchAsync(note.DomainEvents, cancellationToken);
        note.ClearDomainEvents();

        return new CreateNoteResult(note.Id.Value, note.Slug.Value);
    }
}
