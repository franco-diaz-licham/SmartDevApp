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

    public async Task<Note?> GetBySlugAsync(NoteSlug slug, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.BySlug(slug),
            cancellationToken: cancellationToken);

        return documents.SingleOrDefault()?.ToDomain();
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

    public async Task<DocumentPage<Note>> GetPublishedPublicNotesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.PublishedPublic(),
            query.PageSize,
            query.ContinuationToken,
            NoteDocument.PublicPartitionKey,
            cancellationToken);

        return new DocumentPage<Note>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public async Task<IReadOnlyCollection<Note>> GetAllForOwnerAsync(CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryAsync<NoteDocument>(
            NoteDocument.ContainerName,
            CosmosNoteQueries.AllForOwner(),
            cancellationToken: cancellationToken);

        return documents.Select(document => document.ToDomain()).ToArray();
    }

    public async Task AddAsync(Note note, CancellationToken cancellationToken)
    {
        var existing = await GetBySlugAsync(note.Slug, cancellationToken);
        if (existing is not null) throw new InvalidOperationException($"Note slug '{note.Slug.Value}' already exists.");

        var created = await documentStore.TryCreateAsync(
            NoteDocument.ContainerName,
            NoteDocument.FromDomain(note),
            note.Visibility.ToString(),
            cancellationToken);

        if (!created) throw new InvalidOperationException($"Note {note.Id.Value:D} already exists.");
    }

    public async Task SaveAsync(Note note, CancellationToken cancellationToken)
    {
        var existing = await GetBySlugAsync(note.Slug, cancellationToken);
        if (existing is not null && existing.Id != note.Id) throw new InvalidOperationException($"Note slug '{note.Slug.Value}' already exists.");

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

}
