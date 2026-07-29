using System.ComponentModel.DataAnnotations;

namespace SmartDev.Worker.Functions.Configuration.Options;

/// <summary>
/// Configures Serilog logging for the Worker Functions host.
/// </summary>
public sealed class LoggingOptions
{
    /// <summary>
    /// Gets the configuration section name used for host logging settings.
    /// </summary>
    public const string SectionName = "LoggingOptions";

    /// <summary>
    /// Gets the file path where application logs should be written.
    /// </summary>
    [Required]
    public string LogFilePath { get; init; } = "Logs/worker-functions.log";
}
