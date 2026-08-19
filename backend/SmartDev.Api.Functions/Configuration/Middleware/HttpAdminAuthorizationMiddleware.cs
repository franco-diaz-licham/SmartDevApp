using System.Net;
using System.Security.Claims;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Functions;

namespace SmartDev.Api.Functions.Configuration.Middleware;

public sealed class HttpAdminAuthorizationMiddleware(IAccessTokenValidator accessTokenValidator, IAdminAccessAuthorizer adminAccessAuthorizer) : IFunctionsWorkerMiddleware
{
    private const string BearerPrefix = "Bearer ";

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var request = await context.GetHttpRequestDataAsync();
        if (request is null || IsPreflight(request) || !IsOwnerRoute(request)) {
            await next(context);
            return;
        }

        var principal = await ValidateTokenAsync(context, request);
        if (principal is null) return;

        if (!adminAccessAuthorizer.CanAccessAdminArea(principal)) {
            await WriteErrorResponseAsync(context, request, HttpStatusCode.Forbidden, "The authenticated account is not authorised for this owner endpoint.");
            return;
        }

        await next(context);
    }

    private async Task<ClaimsPrincipal?> ValidateTokenAsync(FunctionContext context, HttpRequestData request)
    {
        var accessToken = TryReadBearerToken(request);
        if (string.IsNullOrWhiteSpace(accessToken)) {
            await WriteErrorResponseAsync(context, request, HttpStatusCode.Unauthorized, "Authentication is required.");
            return null;
        }

        var principal = await accessTokenValidator.ValidateAsync(accessToken, context.CancellationToken);
        if (principal is not null) return principal;

        await WriteErrorResponseAsync(context, request, HttpStatusCode.Unauthorized, "The access token is invalid or expired.");
        return null;
    }

    private static bool IsPreflight(HttpRequestData request)
    {
        return string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsOwnerRoute(HttpRequestData request)
    {
        var path = request.Url.AbsolutePath.TrimEnd('/');
        return path.Contains("/api/owner", StringComparison.OrdinalIgnoreCase);
    }

    private static string? TryReadBearerToken(HttpRequestData request)
    {
        if (!request.Headers.TryGetValues("Authorization", out var values)) return null;
        var authorization = values.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(authorization)) return null;
        if (!authorization.StartsWith(BearerPrefix, StringComparison.OrdinalIgnoreCase)) return null;

        return authorization[BearerPrefix.Length..].Trim();
    }

    private static async Task WriteErrorResponseAsync(FunctionContext context, HttpRequestData request, HttpStatusCode statusCode, string message)
    {
        var response = await request.CreateErrorResponseAsync(statusCode, message, context.CancellationToken);
        context.GetInvocationResult().Value = response;
    }
}
