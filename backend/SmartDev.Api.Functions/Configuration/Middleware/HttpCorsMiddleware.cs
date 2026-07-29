using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;

namespace SmartDev.Api.Functions.Configuration.Middleware;

public sealed class HttpCorsMiddleware(HttpCorsHeaders corsHeaders) : IFunctionsWorkerMiddleware
{
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var request = await context.GetHttpRequestDataAsync();
        if (request is null) {
            await next(context);
            return;
        }

        if (!corsHeaders.TryResolveAllowedOrigin(request, out var allowedOrigin)) {
            var forbiddenResponse = request.CreateResponse(HttpStatusCode.Forbidden);
            context.GetInvocationResult().Value = forbiddenResponse;
            return;
        }

        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) {
            var preflightResponse = request.CreateResponse(HttpStatusCode.NoContent);
            if (!string.IsNullOrWhiteSpace(allowedOrigin)) HttpCorsHeaders.Apply(preflightResponse, allowedOrigin);
            context.GetInvocationResult().Value = preflightResponse;
            return;
        }

        await next(context);

        if (string.IsNullOrWhiteSpace(allowedOrigin)) return;
        if (context.GetInvocationResult().Value is not HttpResponseData response) return;

        HttpCorsHeaders.Apply(response, allowedOrigin);
    }
}
