using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.CreateJournalEntry;

public sealed class CreateJournalEntryEndpoint(CreateJournalEntryHandler handler)
{
    [Function(nameof(CreateJournalEntry))]
    public async Task<HttpResponseData> CreateJournalEntry([HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "journal")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        var body = await request.ReadFromJsonAsync<CreateJournalEntryRequest>(cancellationToken);
        if (body is null) return await Result<JournalSaveResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var command = body.ToCommandResult();
        if (!command.IsSuccess) return await command.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(command.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
