using System.Globalization;
using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using SmartDev.Api.Functions.Functions;

namespace SmartDev.Api.Functions.Configuration.Middleware;

public sealed class HttpRateLimitingMiddleware(HttpRateLimiter rateLimiter) : IFunctionsWorkerMiddleware
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var request = await context.GetHttpRequestDataAsync();
        if (request is null || string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) {
            await next(context);
            return;
        }

        if (rateLimiter.TryAcquire(context, request, out var retryAfter)) {
            await next(context);
            return;
        }

        var response = request.CreateResponse(HttpStatusCode.TooManyRequests);
        response.Headers.Add("Content-Type", "application/json");
        response.Headers.Add("Retry-After", Math.Ceiling(retryAfter.TotalSeconds).ToString("F0", CultureInfo.InvariantCulture));

        await response.WriteStringAsync(JsonSerializer.Serialize(
            new ApiErrorResponse((int)HttpStatusCode.TooManyRequests, "Too many requests. Please try again later."),
            SerializerOptions));
        context.GetInvocationResult().Value = response;
    }
}
