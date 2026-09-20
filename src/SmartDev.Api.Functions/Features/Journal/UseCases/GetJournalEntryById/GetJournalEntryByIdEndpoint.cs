using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.GetJournalEntryById;

public sealed class GetJournalEntryByIdEndpoint(GetJournalEntryByIdHandler handler)
{
    [Function(nameof(GetJournalEntryById))]
    public async Task<HttpResponseData> GetJournalEntryById([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "journal/{entryId:guid}")] HttpRequestData request, string entryId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(entryId, out var parsedEntryId)) return await Result.Fail("Journal entry id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(parsedEntryId, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
