using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;

namespace SmartDev.Worker.Functions.Configuration;

/// <summary>
/// Registers Worker Function host-level services and configuration.
/// </summary>
public static class WorkerHostServices
{
    public static FunctionsApplicationBuilder AddHostServices(this FunctionsApplicationBuilder builder)
    {
        builder.ConfigureFunctionsWebApplication();
        builder.Configuration
            .AddJsonFile("host.json", optional: false, reloadOnChange: false)
            .AddEnvironmentVariables();

        return builder;
    }
}
