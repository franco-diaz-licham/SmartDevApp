using Microsoft.Extensions.Configuration;

namespace SmartDev.Shared.Options;

/// <summary>
/// Configures observability exporters for Function hosts.
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
    /// <param name="configuration">The host configuration source.</param>
    /// <returns>The configured observability options.</returns>
    public static ObservabilityOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new ObservabilityOptions();
        configuration.GetSection(SectionName).Bind(options);
        options.ApplicationInsightsConnectionString = configuration[ApplicationInsightsConnectionStringConfigurationKey] ?? string.Empty;

        return options;
    }
}
