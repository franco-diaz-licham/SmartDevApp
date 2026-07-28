using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Functions;

public sealed class ContactEmailFunction(CreateContactEmailHandler handler, HttpCorsHeaders corsHeaders)
{
    [Function(nameof(ContactEmailFunction))]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "contactEmail")]
        HttpRequest request,
        CancellationToken cancellationToken)
    {
        if (!corsHeaders.TryApply(request)) return new StatusCodeResult(StatusCodes.Status403Forbidden);
        if (HttpMethods.IsOptions(request.Method)) return new NoContentResult();

        var body = await request.ReadFromJsonAsync<ContactEmailRequest>(cancellationToken);
        if (body is null) return new BadRequestObjectResult(new ContactEmailErrorResponse("Request body is required."));

        try {
            var result = await handler.HandleAsync(new CreateContactEmailCommand(body.Name, body.Email, body.Message), cancellationToken);
            return new ObjectResult(new ContactEmailAcceptedResponse(result.ContactMessageId)) {
                StatusCode = StatusCodes.Status202Accepted
            };
        } catch (ArgumentException exception) {
            return new BadRequestObjectResult(new ContactEmailErrorResponse(exception.Message));
        } catch (InvalidOperationException exception) {
            return new ObjectResult(new ContactEmailErrorResponse(exception.Message)) {
                StatusCode = (int)HttpStatusCode.Conflict
            };
        }
    }
}

public sealed record ContactEmailRequest(
    string Name,
    string Email,
    string Message);

public sealed record ContactEmailAcceptedResponse(Guid ContactMessageId);

public sealed record ContactEmailErrorResponse(string Error);
