using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Journal.Contracts;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.Infrastructure.Persistence;

public sealed class CosmosJournalRepository(IDocumentStore documentStore) : IJournalRepository
{
    public async Task<JournalEntry?> GetByIdAsync(JournalEntryId id, CancellationToken cancellationToken)
    {
        var document = await documentStore.GetAsync<JournalEntryDocument>(
            JournalEntryDocument.ContainerName,
            id.Value.ToString("D"),
            JournalEntryDocument.PartitionKey,
            cancellationToken);

        return document?.ToDomain();
    }

    public async Task<DocumentPage<JournalEntry>> GetEntriesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<JournalEntryDocument>(
            JournalEntryDocument.ContainerName,
            CosmosJournalQueries.All(query),
            query.PageSize,
            query.ContinuationToken,
            JournalEntryDocument.PartitionKey,
            cancellationToken);

        return new DocumentPage<JournalEntry>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public async Task AddAsync(JournalEntry entry, CancellationToken cancellationToken)
    {
        var created = await documentStore.TryCreateAsync(
            JournalEntryDocument.ContainerName,
            JournalEntryDocument.FromDomain(entry),
            JournalEntryDocument.PartitionKey,
            cancellationToken);

        if (!created) throw new InvalidOperationException($"Journal entry {entry.Id.Value:D} already exists.");
    }

    public Task SaveAsync(JournalEntry entry, CancellationToken cancellationToken)
    {
        return documentStore.UpsertAsync(
            JournalEntryDocument.ContainerName,
            JournalEntryDocument.FromDomain(entry),
            JournalEntryDocument.PartitionKey,
            cancellationToken);
    }
}
