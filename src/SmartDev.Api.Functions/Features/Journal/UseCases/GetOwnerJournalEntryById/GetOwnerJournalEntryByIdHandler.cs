using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Journal.Contracts;
using SmartDev.Api.Functions.Features.Journal.Domain;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.GetOwnerJournalEntryById;

public sealed class GetOwnerJournalEntryByIdHandler(IJournalRepository journalRepository)
{
    public async Task<Result<JournalDetail>> HandleAsync(Guid entryId, CancellationToken cancellationToken)
    {
        var entry = await journalRepository.GetByIdAsync(JournalEntryId.From(entryId), cancellationToken);
        return entry is null
            ? Result<JournalDetail>.Fail("Journal entry was not found.", ResultTypeEnum.NotFound)
            : Result<JournalDetail>.Success(JournalDetail.FromDomain(entry));
    }
}
