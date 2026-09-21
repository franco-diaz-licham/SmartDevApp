using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Configuration.Middleware;

/// <summary>
/// Logs unhandled function exceptions and converts HTTP failures to a generic 500 response without exposing internal details.
/// </summary>
public sealed class HttpExceptionHandlingMiddleware(ILogger<HttpExceptionHandlingMiddleware> logger) : IFunctionsWorkerMiddleware
{
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        try {
            await next(context);
        } catch (Exception exception) {
            logger.LogError(
                exception,
                "Unhandled exception in function {FunctionName} (InvocationId {InvocationId})",
                context.FunctionDefinition.Name,
                context.InvocationId);

            // Non-HTTP triggers rethrow so the host still records the failure and applies trigger retry behavior.
            var request = await context.GetHttpRequestDataAsync();
            if (request is null) throw;

            var response = await request.CreateErrorResponseAsync(HttpStatusCode.InternalServerError, "An unexpected error occurred.", CancellationToken.None);
            context.GetInvocationResult().Value = response;
        }
    }
}
