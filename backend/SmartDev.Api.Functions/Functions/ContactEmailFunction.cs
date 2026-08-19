using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Functions;

public sealed class ContactEmailFunction(CreateContactEmailHandler handler, ILogger<ContactEmailFunction> logger)
{
    [Function(nameof(ContactEmailFunction))]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "contactEmail")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<ContactEmailRequest>(cancellationToken);
        if (body is null) return await Result<CreateContactEmailResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(new CreateContactEmailCommand(body.Name, body.Email, body.Message), cancellationToken);
        if (result.IsSuccess && result.Value is not null) logger.LogInformation("Accepted contact email request. ContactMessageId: {ContactMessageId}.", result.Value.ContactMessageId);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}

public sealed record ContactEmailRequest(string Name, string Email, string Message);
