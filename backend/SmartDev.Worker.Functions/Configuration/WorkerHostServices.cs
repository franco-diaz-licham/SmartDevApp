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
using SmartDev.Worker.Functions.Configuration.Options;

namespace SmartDev.Worker.Functions.Configuration;

/// <summary>
/// Registers Worker Function host-level services and configuration.
/// </summary>
public static class WorkerHostServices
{
    private const string ServiceName = "SmartDev.Worker.Functions";

    public static FunctionsApplicationBuilder AddHostServices(this FunctionsApplicationBuilder builder)
    {
        builder.ConfigureFunctionsWebApplication();
        builder.Configuration
            .AddJsonFile("host.json", optional: false, reloadOnChange: false)
            .AddEnvironmentVariables();

        builder
            .AddSerilog(ServiceName)
            .AddObservability(ServiceName);

        return builder;
    }

    /// <summary>
    /// Configures Serilog console and rolling file logging for the Worker Functions host.
    /// </summary>
    private static FunctionsApplicationBuilder AddSerilog(this FunctionsApplicationBuilder builder, string serviceName)
    {
        builder.Services
            .AddOptions<LoggingOptions>()
            .Bind(builder.Configuration.GetSection(LoggingOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        var loggingOptions = new LoggingOptions();
        builder.Configuration.GetSection(LoggingOptions.SectionName).Bind(loggingOptions);

        var logFile = Path.Combine(builder.Environment.ContentRootPath, loggingOptions.LogFilePath);
        Directory.CreateDirectory(Path.GetDirectoryName(logFile)!);

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Azure", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("ServiceName", serviceName)
            .Enrich.WithProperty("EnvironmentName", builder.Environment.EnvironmentName)
            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}")
            .WriteTo.File(logFile, rollingInterval: RollingInterval.Day, retainedFileCountLimit: 14, shared: true)
            .CreateLogger();

        Serilog.Debugging.SelfLog.Enable(message => {
            File.AppendAllText(Path.Combine(Path.GetDirectoryName(logFile)!, "serilog-selflog.txt"), message);
        });

        builder.Logging.ClearProviders();
        builder.Logging.SetMinimumLevel(LogLevel.Information);
        builder.Logging.AddSerilog(Log.Logger);

        return builder;
    }

    /// <summary>
    /// Configures OpenTelemetry export for the Worker Functions host.
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
                    .AddSource("Azure.*");

                if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) {
                    tracing.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
                }
            })
            .WithMetrics(metrics => {
                metrics.AddRuntimeInstrumentation();

                if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) {
                    metrics.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
                }
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
