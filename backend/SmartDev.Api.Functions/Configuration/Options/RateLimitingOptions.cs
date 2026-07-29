using System.ComponentModel.DataAnnotations;

namespace SmartDev.Api.Functions.Configuration.Options;

/// <summary>
/// Configures HTTP rate limiting for the API Functions app.
/// </summary>
public sealed class RateLimitingOptions
{
    /// <summary>
    /// Gets the configuration section name used for HTTP rate limiting.
    /// </summary>
    public const string SectionName = "RateLimiting";

    /// <summary>
    /// Gets whether HTTP rate limiting is enabled.
    /// </summary>
    public bool Enabled { get; init; } = true;

    /// <summary>
    /// Gets the default rate limit policy applied to HTTP functions.
    /// </summary>
    [Required]
    public RateLimitPolicyOptions DefaultPolicy { get; init; } = new();

    /// <summary>
    /// Gets rate limit policies keyed by Azure Functions function name.
    /// </summary>
    public Dictionary<string, RateLimitPolicyOptions> Policies { get; init; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// Configures a fixed-window rate limit policy.
/// </summary>
public sealed class RateLimitPolicyOptions
{
    /// <summary>
    /// Gets whether this policy is enabled.
    /// </summary>
    public bool Enabled { get; init; } = true;

    /// <summary>
    /// Gets the maximum number of requests allowed within the configured window.
    /// </summary>
    [Range(1, int.MaxValue)]
    public int PermitLimit { get; init; } = 60;

    /// <summary>
    /// Gets the fixed window duration, in seconds.
    /// </summary>
    [Range(1, int.MaxValue)]
    public int WindowSeconds { get; init; } = 60;
}
