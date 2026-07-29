using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Functions;

public sealed class ContactEmailFunction(CreateContactEmailHandler handler)
{
    [Function(nameof(ContactEmailFunction))]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "contactEmail")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<ContactEmailRequest>(cancellationToken);
        if (body is null) return await CreateJsonResponseAsync(request, HttpStatusCode.BadRequest, new ContactEmailErrorResponse("Request body is required."), cancellationToken);

        try {
            var result = await handler.HandleAsync(new CreateContactEmailCommand(body.Name, body.Email, body.Message), cancellationToken);
            return await CreateJsonResponseAsync(request, HttpStatusCode.Accepted, new ContactEmailAcceptedResponse(result.ContactMessageId), cancellationToken);
        } catch (ArgumentException exception) {
            return await CreateJsonResponseAsync(request, HttpStatusCode.BadRequest, new ContactEmailErrorResponse(exception.Message), cancellationToken);
        } catch (InvalidOperationException exception) {
            return await CreateJsonResponseAsync(request, HttpStatusCode.Conflict, new ContactEmailErrorResponse(exception.Message), cancellationToken);
        }
    }

    private static async Task<HttpResponseData> CreateJsonResponseAsync<TResponse>(
        HttpRequestData request,
        HttpStatusCode statusCode,
        TResponse body,
        CancellationToken cancellationToken)
    {
        var response = request.CreateResponse(statusCode);
        await response.WriteAsJsonAsync(body, cancellationToken);
        return response;
    }
}

public sealed record ContactEmailRequest(
    string Name,
    string Email,
    string Message);

public sealed record ContactEmailAcceptedResponse(Guid ContactMessageId);

public sealed record ContactEmailErrorResponse(string Error);
