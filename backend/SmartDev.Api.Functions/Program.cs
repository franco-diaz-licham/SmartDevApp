using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartDev.Infrastructure.Configuration;

var host = new HostBuilder()
    .ConfigureAppConfiguration((_, configuration) => {
        configuration
            .AddJsonFile("host.json", optional: false, reloadOnChange: false)
            .AddEnvironmentVariables();
    })
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddCosmosDocumentStore(context.Configuration);
    })
    .Build();

host.Run();
