using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Configuration.Middleware;

public sealed class HttpCorsHeaders(IOptions<CorsOptions> options)
{
    /// <summary>
    /// Stores the normalized origins that are allowed to call this Functions host from a browser.
    /// </summary>
    private readonly HashSet<string> _allowedOrigins = options.Value.AllowedOrigins
        .Where(origin => !string.IsNullOrWhiteSpace(origin))
        .Select(origin => origin.Trim().TrimEnd('/'))
        .ToHashSet(StringComparer.OrdinalIgnoreCase);

    public bool TryResolveAllowedOrigin(HttpRequestData request, out string? allowedOrigin)
    {
        allowedOrigin = null;
        if (!request.Headers.TryGetValues("Origin", out var originValues)) return true;

        var origin = originValues.FirstOrDefault()?.Trim().TrimEnd('/');
        if (string.IsNullOrWhiteSpace(origin)) return true;
        if (!_allowedOrigins.Contains(origin)) return false;

        allowedOrigin = origin;
        return true;
    }

    public static void Apply(HttpResponseData response, string allowedOrigin)
    {
        response.Headers.Remove("Access-Control-Allow-Origin");
        response.Headers.Remove("Access-Control-Allow-Methods");
        response.Headers.Remove("Access-Control-Allow-Headers");
        response.Headers.Remove("Vary");

        response.Headers.Add("Access-Control-Allow-Origin", allowedOrigin);
        response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
        response.Headers.Add("Vary", "Origin");
    }
}
