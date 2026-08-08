using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Notes;
using SmartDev.Api.Functions.Functions;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed class GetPublicNotesHandler(INoteRepository noteRepository)
{
    public async Task<CursorPage<PublicNoteListItem>> HandleAsync(int pageSize, string? continuationToken, CancellationToken cancellationToken)
    {
        var notes = await noteRepository.GetPublishedPublicNotesAsync(pageSize, continuationToken, cancellationToken);
        return new CursorPage<PublicNoteListItem>(notes.Items.Select(PublicNoteListItem.FromDomain).ToArray(), notes.ContinuationToken);
    }
}

public sealed class GetPublicNoteBySlugHandler(INoteRepository noteRepository)
{
    public async Task<PublicNoteDetail?> HandleAsync(string slug, CancellationToken cancellationToken)
    {
        var note = await noteRepository.GetBySlugAsync(NoteSlug.Create(slug), cancellationToken);
        if (note is null || note.Status != NoteStatus.Published || note.Visibility != NoteVisibility.Public) return null;
        return PublicNoteDetail.FromDomain(note);
    }
}

public sealed class GetPublicNoteCategoriesHandler(INoteRepository noteRepository)
{
    public async Task<IReadOnlyCollection<string>> HandleAsync(CancellationToken cancellationToken)
    {
        var notes = await noteRepository.GetPublishedPublicNotesAsync(cancellationToken);
        return notes
            .Select(note => note.Category.DisplayName)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Order(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }
}

public sealed class GetPublicNoteTagsHandler(INoteRepository noteRepository)
{
    public async Task<IReadOnlyCollection<string>> HandleAsync(CancellationToken cancellationToken)
    {
        var notes = await noteRepository.GetPublishedPublicNotesAsync(cancellationToken);
        return notes
            .SelectMany(note => note.Tags.Select(tag => tag.DisplayName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Order(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }
}

public sealed class SearchPublicNotesHandler(INoteRepository noteRepository)
{
    public async Task<IReadOnlyCollection<PublicNoteListItem>> HandleAsync(string query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query)) return [];

        var normalizedQuery = query.Trim();
        var notes = await noteRepository.GetPublishedPublicNotesAsync(cancellationToken);
        return notes
            .Where(note => note.SearchableText.Contains(normalizedQuery, StringComparison.OrdinalIgnoreCase))
            .Select(PublicNoteListItem.FromDomain)
            .ToArray();
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
            $"/notes/{note.Slug.Value}",
            note.UpdatedAt,
            note.PublishedAt);
    }
}
