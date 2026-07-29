using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Azure.Functions.Worker.OpenTelemetry;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Events;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Configuration;

/// <summary>
/// Registers API Function host-level services and configuration.
/// </summary>
public static class ApiHostServices
{
    public static FunctionsApplicationBuilder AddHostServices(this FunctionsApplicationBuilder builder)
    {
        builder.Configuration
            .AddJsonFile("host.json", optional: false, reloadOnChange: false)
            .AddEnvironmentVariables();

        var loggingOptions = GetLoggingOptions(builder);

        builder
            .AddSerilog(loggingOptions)
            .AddObservability(loggingOptions.ServiceName);

        return builder;
    }

    private static LoggingOptions GetLoggingOptions(FunctionsApplicationBuilder builder)
    {
        var loggingOptions = new LoggingOptions();
        builder.Configuration.GetSection(LoggingOptions.SectionName).Bind(loggingOptions);

        return loggingOptions;
    }

    /// <summary>
    /// Configures Serilog console and rolling file logging for the API Functions host.
    /// </summary>
    private static FunctionsApplicationBuilder AddSerilog(this FunctionsApplicationBuilder builder, LoggingOptions loggingOptions)
    {
        builder.Services
            .AddOptions<LoggingOptions>()
            .Bind(builder.Configuration.GetSection(LoggingOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // Serilog must be configured before the DI container builds, so we resolve
        // the file path directly here using the bound value from configuration.
        var logFile = Path.Combine(builder.Environment.ContentRootPath, loggingOptions.LogFilePath);
        Directory.CreateDirectory(Path.GetDirectoryName(logFile)!);

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Azure", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("ServiceName", loggingOptions.ServiceName)
            .Enrich.WithProperty("EnvironmentName", builder.Environment.EnvironmentName)
            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}")
            .WriteTo.File(logFile, rollingInterval: RollingInterval.Day, retainedFileCountLimit: 14, shared: true)
            .CreateLogger();

        // Force Serilog to export an error file if problems occur during startup.
        Serilog.Debugging.SelfLog.Enable(message => {
            File.AppendAllText(Path.Combine(Path.GetDirectoryName(logFile)!, "serilog-selflog.txt"), message);
        });

        // Plug Serilog into .NET logging as the app initialises.
        builder.Logging.ClearProviders();
        builder.Logging.SetMinimumLevel(LogLevel.Information);
        builder.Logging.AddSerilog(Log.Logger);

        return builder;
    }

    /// <summary>
    /// Configures OpenTelemetry export for the API Functions host.
    /// </summary>
    private static FunctionsApplicationBuilder AddObservability(this FunctionsApplicationBuilder builder, string serviceName)
    {
        builder.Services
            .AddOptions<ObservabilityOptions>()
            .Bind(builder.Configuration.GetSection(ObservabilityOptions.SectionName))
            .ValidateOnStart();

        var observabilityOptions = new ObservabilityOptions();
        builder.Configuration.GetSection(ObservabilityOptions.SectionName).Bind(observabilityOptions);

        AppContext.SetSwitch("Azure.Experimental.EnableActivitySource", true);

        builder.Logging.AddOpenTelemetry(logging => {
            logging.IncludeFormattedMessage = true;
            logging.IncludeScopes = true;
            logging.ParseStateValues = true;
            logging.SetResourceBuilder(ResourceBuilder.CreateDefault()
                .AddService(serviceName)
                .AddAttributes([new KeyValuePair<string, object>("deployment.environment", builder.Environment.EnvironmentName)]));

            if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) {
                logging.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
            }
        });

        var openTelemetry = builder.Services
            .AddOpenTelemetry()
            .UseFunctionsWorkerDefaults()
            .ConfigureResource(resource => resource
                .AddService(serviceName)
                .AddAttributes([new KeyValuePair<string, object>("deployment.environment", builder.Environment.EnvironmentName)]))
            .WithTracing(tracing => {
                tracing
                    .AddHttpClientInstrumentation()
                    .AddSource("Azure.*", "Azure.Cosmos.Operation");

                if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) {
                    tracing.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
                }
            })
            .WithMetrics(metrics => {
                metrics.AddRuntimeInstrumentation();

                if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) metrics.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
            });

        var useAzureMonitorExporter = !string.IsNullOrWhiteSpace(observabilityOptions.ApplicationInsightsConnectionString);
        if (useAzureMonitorExporter) {
            openTelemetry.UseAzureMonitorExporter(options => {
                options.ConnectionString = observabilityOptions.ApplicationInsightsConnectionString;
            });
        }

        return builder;
    }
}
