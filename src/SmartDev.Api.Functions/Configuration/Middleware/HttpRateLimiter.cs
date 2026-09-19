using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Configuration.Middleware;

public sealed class HttpRateLimiter(IOptions<RateLimitingOptions> options)
{
    /// <summary>
    /// Coordinates access to the in-memory client windows so request counts are updated atomically.
    /// </summary>
    private readonly object _syncRoot = new();

    /// <summary>
    /// Stores the active fixed rate-limit windows by function name and resolved client address.
    /// </summary>
    private readonly Dictionary<string, ClientWindow> _windows = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Holds the validated rate-limiting configuration used to resolve the default or function-specific policy.
    /// </summary>
    private readonly RateLimitingOptions _options = options.Value;

    public bool TryAcquire(FunctionContext context, HttpRequestData request, out TimeSpan retryAfter)
    {
        retryAfter = TimeSpan.Zero;
        if (!_options.Enabled) return true;

        var functionName = context.FunctionDefinition.Name;
        var policy = ResolvePolicy(functionName);
        if (!policy.Enabled) return true;

        var now = DateTimeOffset.UtcNow;
        var clientAddress = ResolveClientAddress(request);
        var rateLimitKey = BuildRateLimitKey(functionName, clientAddress);

        lock (_syncRoot) {
            var currentWindow = GetCurrentWindow(rateLimitKey, policy, now);
            currentWindow.Count += 1;
            if (currentWindow.Count <= policy.PermitLimit) return true;
            retryAfter = GetRetryAfter(currentWindow, now);
            return false;
        }
    }

    private RateLimitPolicyOptions ResolvePolicy(string functionName)
    {
        if (_options.Policies.TryGetValue(functionName, out var policy)) return policy;
        return _options.DefaultPolicy;
    }

    private ClientWindow GetCurrentWindow(string rateLimitKey, RateLimitPolicyOptions policy, DateTimeOffset now)
    {
        if (!_windows.TryGetValue(rateLimitKey, out var currentWindow)) return StartNewWindow(rateLimitKey, policy, now);
        if (currentWindow.ResetAt <= now) return StartNewWindow(rateLimitKey, policy, now);
        return currentWindow;
    }

    private ClientWindow StartNewWindow(string rateLimitKey, RateLimitPolicyOptions policy, DateTimeOffset now)
    {
        var resetAt = now.AddSeconds(policy.WindowSeconds);
        var newWindow = new ClientWindow(resetAt);
        _windows[rateLimitKey] = newWindow;
        return newWindow;
    }

    private static string BuildRateLimitKey(string functionName, string clientAddress)
    {
        return $"{functionName}:{clientAddress}";
    }

    private static string ResolveClientAddress(HttpRequestData request)
    {
        var forwardedFor = GetHeaderValue(request, "X-Forwarded-For");
        if (!string.IsNullOrWhiteSpace(forwardedFor)) {
            var forwardedAddress = GetFirstForwardedAddress(forwardedFor);
            if (!string.IsNullOrWhiteSpace(forwardedAddress)) return forwardedAddress;
        }

        var azureClientIp = GetHeaderValue(request, "X-Azure-ClientIP");
        if (!string.IsNullOrWhiteSpace(azureClientIp)) return azureClientIp;

        return "unknown";
    }

    private static string? GetHeaderValue(HttpRequestData request, string headerName)
    {
        if (!request.Headers.TryGetValues(headerName, out var values)) return null;
        return values.FirstOrDefault();
    }

    private static string? GetFirstForwardedAddress(string forwardedFor)
    {
        return forwardedFor
            .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .FirstOrDefault();
    }

    private static TimeSpan GetRetryAfter(ClientWindow currentWindow, DateTimeOffset now)
    {
        var retryAfter = currentWindow.ResetAt - now;
        return retryAfter < TimeSpan.Zero ? TimeSpan.Zero : retryAfter;
    }

    private sealed class ClientWindow(DateTimeOffset resetAt)
    {
        public DateTimeOffset ResetAt { get; } = resetAt;

        public int Count { get; set; }
    }
}
