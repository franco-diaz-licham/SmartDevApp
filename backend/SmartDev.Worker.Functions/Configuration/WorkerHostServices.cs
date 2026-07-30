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
    private const string AzureCommunicationEmailActivitySourceName = "Azure.Communication.Email";
    private const string AzureCoreActivitySourceName = "Azure.Core";
    private const string AzureServiceBusActivitySourceName = "Azure.Messaging.ServiceBus";

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
    /// Configures Serilog console logging for the Worker Functions host.
    /// </summary>
    private static FunctionsApplicationBuilder AddSerilog(this FunctionsApplicationBuilder builder, LoggingOptions loggingOptions)
    {
        builder.Services
            .AddOptions<LoggingOptions>()
            .Bind(builder.Configuration.GetSection(LoggingOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Azure", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("ServiceName", loggingOptions.ServiceName)
            .Enrich.WithProperty("EnvironmentName", builder.Environment.EnvironmentName)
            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}")
            .CreateLogger();

        Serilog.Debugging.SelfLog.Enable(message => Console.Error.WriteLine(message));
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
            .Configure(options => {
                var configuredOptions = ObservabilityOptions.FromConfiguration(builder.Configuration);
                options.OtlpEndpoint = configuredOptions.OtlpEndpoint;
                options.ApplicationInsightsConnectionString = configuredOptions.ApplicationInsightsConnectionString;
            })
            .ValidateOnStart();

        var observabilityOptions = ObservabilityOptions.FromConfiguration(builder.Configuration);

        AppContext.SetSwitch("Azure.Experimental.EnableActivitySource", true);

        builder.Logging.AddOpenTelemetry(logging => {
            logging.IncludeFormattedMessage = true;
            logging.IncludeScopes = true;
            logging.ParseStateValues = true;
            logging.SetResourceBuilder(CreateResourceBuilder(serviceName, builder.Environment.EnvironmentName));
            if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) logging.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
        });

        var openTelemetry = builder.Services
            .AddOpenTelemetry()
            .UseFunctionsWorkerDefaults()
            .ConfigureResource(resource => resource.AddService(serviceName).AddAttributes(CreateResourceAttributes(builder.Environment.EnvironmentName)))
            .WithTracing(tracing => {
                tracing
                    .AddHttpClientInstrumentation()
                    .AddSource(serviceName)
                    .AddSource(AzureCommunicationEmailActivitySourceName)
                    .AddSource(AzureCoreActivitySourceName)
                    .AddSource(AzureServiceBusActivitySourceName);
                if (!string.IsNullOrWhiteSpace(observabilityOptions.OtlpEndpoint)) tracing.AddOtlpExporter(options => options.Endpoint = new Uri(observabilityOptions.OtlpEndpoint));
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

    private static ResourceBuilder CreateResourceBuilder(string serviceName, string environmentName)
    {
        return ResourceBuilder
            .CreateDefault()
            .AddService(serviceName)
            .AddAttributes(CreateResourceAttributes(environmentName));
    }

    private static KeyValuePair<string, object>[] CreateResourceAttributes(string environmentName)
    {
        return [new KeyValuePair<string, object>("deployment.environment", environmentName)];
    }
}
