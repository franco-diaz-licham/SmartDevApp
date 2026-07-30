using Microsoft.Extensions.Configuration;

namespace SmartDev.Api.Functions.Configuration.Options;

/// <summary>
/// Configures observability exporters for the API Functions host.
/// </summary>
public sealed class ObservabilityOptions
{
    private const string ApplicationInsightsConnectionStringConfigurationKey = "APPLICATIONINSIGHTS_CONNECTION_STRING";

    /// <summary>
    /// Gets the configuration section name used for observability settings.
    /// </summary>
    public const string SectionName = "Observability";

    /// <summary>
    /// Gets the OpenTelemetry Protocol endpoint used to export telemetry.
    /// </summary>
    public string OtlpEndpoint { get; set; } = string.Empty;

    /// <summary>
    /// Gets the Application Insights connection string used by Azure Monitor telemetry export.
    /// </summary>
    public string ApplicationInsightsConnectionString { get; set; } = string.Empty;

    /// <summary>
    /// Creates observability options from host configuration.
    /// </summary>
    public static ObservabilityOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new ObservabilityOptions();
        configuration.GetSection(SectionName).Bind(options);
        options.ApplicationInsightsConnectionString = configuration[ApplicationInsightsConnectionStringConfigurationKey] ?? string.Empty;
        return options;
    }
}
