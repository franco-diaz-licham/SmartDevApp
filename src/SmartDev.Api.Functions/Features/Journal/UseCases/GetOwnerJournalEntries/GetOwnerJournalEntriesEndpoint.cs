using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.GetOwnerJournalEntries;

public sealed class GetOwnerJournalEntriesEndpoint(GetOwnerJournalEntriesHandler handler)
{
    [Function(nameof(GetOwnerJournalEntries))]
    public async Task<HttpResponseData> GetOwnerJournalEntries([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "owner/journal")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult(defaultPageSize: 30, maxPageSize: 100);
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
