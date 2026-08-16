using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class CosmosNoteRepository(IDocumentStore documentStore) : INoteRepository
{
    public async Task<Note?> GetByIdAsync(NoteId id, CancellationToken cancellationToken)
    {
        var publicDocument = await documentStore.GetAsync<NoteDocument>(
            NoteDocument.ContainerName,
            id.Value.ToString("D"),
            NoteDocument.PublicPartitionKey,
            cancellationToken);

        if (publicDocument is not null) return publicDocument.ToDomain();

        var privateDocument = await documentStore.GetAsync<NoteDocument>(
            NoteDocument.ContainerName,
            id.Value.ToString("D"),
            NoteDocument.PrivatePartitionKey,
            cancellationToken);

        return privateDocument?.ToDomain();
    }

    public async Task<DocumentPage<Note>> GetPublishedPublicNotesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.PublishedPublic(query),
            query.PageSize,
            query.ContinuationToken,
            NoteDocument.PublicPartitionKey,
            cancellationToken);

        return new DocumentPage<Note>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public async Task<IReadOnlyCollection<Note>> GetPublishedPublicNotesAsync(CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.PublishedPublic(),
            NoteDocument.PublicPartitionKey,
            cancellationToken);

        return documents.Select(document => document.ToDomain()).ToArray();
    }

    public async Task<DocumentPage<Note>> SearchPublishedPublicNotesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query.SearchTerm)) return new DocumentPage<Note>([], null);

        var documents = await documentStore.QueryPageAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.PublishedPublicSearch(query.SearchTerm),
            query.PageSize,
            query.ContinuationToken,
            NoteDocument.PublicPartitionKey,
            cancellationToken);

        return new DocumentPage<Note>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public Task<DocumentPage<string>> GetPublishedPublicCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        return documentStore.QueryPageAsync<string>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.PublishedPublicCategoryNames(),
            query.PageSize,
            query.ContinuationToken,
            NoteDocument.PublicPartitionKey,
            cancellationToken);
    }

    public Task<DocumentPage<string>> GetOwnerCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        return documentStore.QueryPageAsync<string>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.OwnerCategoryNames(),
            query.PageSize,
            query.ContinuationToken,
            cancellationToken: cancellationToken);
    }

    public Task<DocumentPage<string>> GetPublishedPublicTagNamesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        return documentStore.QueryPageAsync<string>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.PublishedPublicTagNames(),
            query.PageSize,
            query.ContinuationToken,
            NoteDocument.PublicPartitionKey,
            cancellationToken);
    }

    public async Task<DocumentPage<Note>> GetAllForOwnerAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.AllForOwner(query),
            query.PageSize,
            query.ContinuationToken,
            cancellationToken: cancellationToken);

        return new DocumentPage<Note>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public async Task AddAsync(Note note, CancellationToken cancellationToken)
    {
        if (await SlugExistsAsync(note.Slug, excludedNoteId: null, cancellationToken)) {
            throw new InvalidOperationException($"Note slug '{note.Slug.Value}' already exists.");
        }

        var created = await documentStore.TryCreateAsync(
            NoteDocument.ContainerName,
            NoteDocument.FromDomain(note),
            note.Visibility.ToString(),
            cancellationToken);

        if (!created) throw new InvalidOperationException($"Note {note.Id.Value:D} already exists.");
    }

    public async Task SaveAsync(Note note, CancellationToken cancellationToken)
    {
        if (await SlugExistsAsync(note.Slug, note.Id, cancellationToken)) {
            throw new InvalidOperationException($"Note slug '{note.Slug.Value}' already exists.");
        }

        var partitionKey = note.Visibility.ToString();
        var previousPartitionKey = partitionKey == NoteDocument.PublicPartitionKey
            ? NoteDocument.PrivatePartitionKey
            : NoteDocument.PublicPartitionKey;

        await documentStore.UpsertAsync(
            NoteDocument.ContainerName,
            NoteDocument.FromDomain(note),
            partitionKey,
            cancellationToken);

        await documentStore.DeleteAsync(
            NoteDocument.ContainerName,
            note.Id.Value.ToString("D"),
            previousPartitionKey,
            cancellationToken);
    }

    private async Task<bool> SlugExistsAsync(NoteSlug slug, NoteId? excludedNoteId, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<string>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.SlugIds(slug),
            pageSize: 2,
            cancellationToken: cancellationToken);

        return documents.Items.Any(id => excludedNoteId is null || !string.Equals(id, excludedNoteId.Value.Value.ToString("D"), StringComparison.OrdinalIgnoreCase));
    }

}
