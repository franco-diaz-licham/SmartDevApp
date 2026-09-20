using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.UpdateOwnerJournalEntry;

public sealed class UpdateOwnerJournalEntryEndpoint(UpdateOwnerJournalEntryHandler handler)
{
    [Function(nameof(UpdateOwnerJournalEntry))]
    public async Task<HttpResponseData> UpdateOwnerJournalEntry([HttpTrigger(AuthorizationLevel.Anonymous, "put", "options", Route = "owner/journal/{entryId:guid}")] HttpRequestData request, string entryId, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);
        if (!Guid.TryParse(entryId, out var parsedEntryId)) return await Result.Fail("Journal entry id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var body = await request.ReadFromJsonAsync<UpdateOwnerJournalEntryRequest>(cancellationToken);
        if (body is null) return await Result<JournalSaveResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var command = body.ToCommandResult(parsedEntryId);
        if (!command.IsSuccess) return await command.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(command.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
