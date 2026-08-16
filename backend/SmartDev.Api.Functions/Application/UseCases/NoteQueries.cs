using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed class GetPublicNotesHandler(INoteRepository noteRepository)
{
    public async Task<Page<PublicNoteListItem>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var notes = await noteRepository.GetPublishedPublicNotesAsync(query, cancellationToken);
        return new Page<PublicNoteListItem>(notes.Items.Select(PublicNoteListItem.FromDomain).ToArray(), notes.ContinuationToken);
    }
}

public sealed class GetOwnerNotesHandler(INoteRepository noteRepository)
{
    public async Task<Page<PublicNoteListItem>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var notes = await noteRepository.GetAllForOwnerAsync(query, cancellationToken);
        return new Page<PublicNoteListItem>(notes.Items.Select(PublicNoteListItem.FromDomain).ToArray(), notes.ContinuationToken);
    }
}

public sealed class GetOwnerNoteByIdHandler(INoteRepository noteRepository)
{
    public async Task<PublicNoteDetail?> HandleAsync(Guid noteId, CancellationToken cancellationToken)
    {
        var note = await noteRepository.GetByIdAsync(NoteId.From(noteId), cancellationToken);
        return note is null ? null : PublicNoteDetail.FromDomain(note);
    }
}

public sealed class GetPublicNoteByIdHandler(INoteRepository noteRepository)
{
    public async Task<PublicNoteDetail?> HandleAsync(Guid noteId, CancellationToken cancellationToken)
    {
        var note = await noteRepository.GetByIdAsync(NoteId.From(noteId), cancellationToken);
        if (note is null || note.Status != NoteStatus.Published || note.Visibility != NoteVisibility.Public) return null;
        return PublicNoteDetail.FromDomain(note);
    }
}

public sealed class GetPublicNoteCategoriesHandler(INoteRepository noteRepository)
{
    public async Task<Page<string>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var categories = await noteRepository.GetPublishedPublicCategoryNamesAsync(query, cancellationToken);
        return new Page<string>(categories.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), categories.ContinuationToken);
    }
}

public sealed class GetOwnerNoteCategoriesHandler(INoteRepository noteRepository)
{
    public async Task<Page<string>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var categories = await noteRepository.GetOwnerCategoryNamesAsync(query, cancellationToken);
        return new Page<string>(categories.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), categories.ContinuationToken);
    }
}

public sealed class GetPublicNoteTagsHandler(INoteRepository noteRepository)
{
    public async Task<Page<string>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var tags = await noteRepository.GetPublishedPublicTagNamesAsync(query, cancellationToken);
        return new Page<string>(tags.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), tags.ContinuationToken);
    }
}

public sealed class SearchPublicNotesHandler(INoteRepository noteRepository)
{
    public async Task<Page<PublicNoteListItem>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query.SearchTerm)) return new Page<PublicNoteListItem>([], null);

        var notes = await noteRepository.SearchPublishedPublicNotesAsync(query, cancellationToken);
        return new Page<PublicNoteListItem>(notes.Items.Select(PublicNoteListItem.FromDomain).ToArray(), notes.ContinuationToken);
    }
}

public sealed class GetPublicNoteSearchIndexHandler(INoteRepository noteRepository)
{
    public async Task<PublicSearchIndexResponse> HandleAsync(CancellationToken cancellationToken)
    {
        var notes = await noteRepository.GetPublishedPublicNotesAsync(cancellationToken);
        return new PublicSearchIndexResponse(
            DateTimeOffset.UtcNow,
            notes.Select(PublicNoteSearchDocument.FromDomain).ToArray());
    }
}

public sealed record PublicNoteListItem(
    string Id,
    string Slug,
    string Title,
    string Summary,
    PublicNoteCategory Category,
    IReadOnlyCollection<PublicNoteTag> Tags,
    string Status,
    string Visibility,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset PublishedAt)
{
    public static PublicNoteListItem FromDomain(Note note)
    {
        return new PublicNoteListItem(
            note.Id.Value.ToString("D"),
            note.Slug.Value,
            note.Title.Value,
            note.Summary.Value,
            PublicNoteCategory.FromDomain(note.Category),
            note.Tags.Select(PublicNoteTag.FromDomain).ToArray(),
            note.Status.ToString(),
            note.Visibility.ToString(),
            note.UpdatedAt,
            note.PublishedAt ?? note.UpdatedAt ?? note.CreatedAt);
    }
}

public sealed record PublicNoteDetail(
    string Id,
    string Slug,
    string Title,
    string Summary,
    PublicNoteCategory Category,
    IReadOnlyCollection<PublicNoteTag> Tags,
    string Status,
    string Visibility,
    string BodyMarkdown,
    IReadOnlyCollection<PublicRelatedProjectReference> RelatedProjects,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset PublishedAt)
{
    public static PublicNoteDetail FromDomain(Note note)
    {
        return new PublicNoteDetail(
            note.Id.Value.ToString("D"),
            note.Slug.Value,
            note.Title.Value,
            note.Summary.Value,
            PublicNoteCategory.FromDomain(note.Category),
            note.Tags.Select(PublicNoteTag.FromDomain).ToArray(),
            note.Status.ToString(),
            note.Visibility.ToString(),
            note.Body.Value,
            note.RelatedProjects.Select(project => new PublicRelatedProjectReference(project.ProjectId, project.Label)).ToArray(),
            note.UpdatedAt,
            note.PublishedAt ?? note.UpdatedAt ?? note.CreatedAt);
    }
}

public sealed record PublicRelatedProjectReference(string ProjectId, string Label);

public sealed record PublicNoteCategory(string Slug, string DisplayName)
{
    public static PublicNoteCategory FromDomain(NoteCategorySnapshot category) => new(category.Slug.Value, category.DisplayName);
}

public sealed record PublicNoteTag(string Slug, string DisplayName)
{
    public static PublicNoteTag FromDomain(NoteTagSnapshot tag) => new(tag.Slug.Value, tag.DisplayName);
}

public sealed record PublicSearchIndexResponse(DateTimeOffset GeneratedAt, IReadOnlyCollection<PublicNoteSearchDocument> Documents);

public sealed record PublicNoteSearchDocument(
    string Id,
    string Type,
    string Slug,
    string Title,
    string Summary,
    string Category,
    IReadOnlyCollection<string> Tags,
    string BodyText,
    string Url,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset? PublishedAt)
{
    public static PublicNoteSearchDocument FromDomain(Note note)
    {
        return new PublicNoteSearchDocument(
            note.Id.Value.ToString("D"),
            "note",
            note.Slug.Value,
            note.Title.Value,
            note.Summary.Value,
            note.Category.DisplayName,
            note.Tags.Select(tag => tag.DisplayName).ToArray(),
            note.Body.Value,
            $"/workspace/notes/{note.Id.Value:D}",
            note.UpdatedAt,
            note.PublishedAt);
    }
}
