using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Functions;

public sealed class HttpCorsHeaders(IOptions<CorsOptions> options)
{
    private readonly HashSet<string> allowedOrigins = options.Value.AllowedOrigins
        .Where(origin => !string.IsNullOrWhiteSpace(origin))
        .Select(origin => origin.Trim().TrimEnd('/'))
        .ToHashSet(StringComparer.OrdinalIgnoreCase);

    public bool TryApply(HttpRequest request)
    {
        if (!request.Headers.TryGetValue("Origin", out var originValues)) return true;

        var origin = originValues.ToString().Trim().TrimEnd('/');
        if (!allowedOrigins.Contains(origin)) return false;

        var headers = request.HttpContext.Response.Headers;
        headers.AccessControlAllowOrigin = origin;
        headers.AccessControlAllowMethods = "POST, OPTIONS";
        headers.AccessControlAllowHeaders = "Content-Type";
        headers.Vary = "Origin";

        return true;
    }
}
