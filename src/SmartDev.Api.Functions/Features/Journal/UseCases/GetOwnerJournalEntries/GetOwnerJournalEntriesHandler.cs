using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Journal.Contracts;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.GetOwnerJournalEntries;

public sealed class GetOwnerJournalEntriesHandler(IJournalRepository journalRepository)
{
    public async Task<Result<Page<JournalListItem>>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var entries = await journalRepository.GetEntriesAsync(query, cancellationToken);
        var response = new Page<JournalListItem>(entries.Items.Select(JournalListItem.FromDomain).ToArray(), entries.ContinuationToken);
        return Result<Page<JournalListItem>>.Success(response);
    }
}
