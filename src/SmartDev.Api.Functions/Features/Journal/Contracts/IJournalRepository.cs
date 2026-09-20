using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.Contracts;

/// <summary>
/// Persists private journal entries.
/// </summary>
public interface IJournalRepository
{
    Task<JournalEntry?> GetByIdAsync(JournalEntryId id, CancellationToken cancellationToken);

    Task<DocumentPage<JournalEntry>> GetEntriesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task AddAsync(JournalEntry entry, CancellationToken cancellationToken);

    Task SaveAsync(JournalEntry entry, CancellationToken cancellationToken);
}
