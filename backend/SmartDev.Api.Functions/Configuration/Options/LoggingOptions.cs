using System.ComponentModel.DataAnnotations;

namespace SmartDev.Api.Functions.Configuration.Options;

/// <summary>
/// Configures Serilog logging for the API Functions host.
/// </summary>
public sealed class LoggingOptions
{
    /// <summary>
    /// Gets the configuration section name used for host logging settings.
    /// </summary>
    public const string SectionName = "LoggingOptions";

    /// <summary>
    /// Gets the service name used to enrich logs and identify the host in telemetry.
    /// </summary>
    [Required]
    public string ServiceName { get; init; } = "SmartDev.Api.Functions";

}
