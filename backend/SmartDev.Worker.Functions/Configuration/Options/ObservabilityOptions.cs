namespace SmartDev.Worker.Functions.Configuration.Options;

/// <summary>
/// Configures observability exporters for the Worker Functions host.
/// </summary>
public sealed class ObservabilityOptions
{
    /// <summary>
    /// Gets the configuration section name used for observability settings.
    /// </summary>
    public const string SectionName = "Observability";

    /// <summary>
    /// Gets the OpenTelemetry Protocol endpoint used to export telemetry.
    /// </summary>
    public string OtlpEndpoint { get; init; } = string.Empty;
}
