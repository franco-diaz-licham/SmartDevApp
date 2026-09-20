using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.GetJournalEntries;

public sealed class GetJournalEntriesEndpoint(GetJournalEntriesHandler handler)
{
    [Function(nameof(GetJournalEntries))]
    public async Task<HttpResponseData> GetJournalEntries([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "journal")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult(defaultPageSize: 30, maxPageSize: 100);
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
