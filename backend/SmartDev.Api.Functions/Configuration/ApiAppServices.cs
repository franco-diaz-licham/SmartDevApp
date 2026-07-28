using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Azure.Cosmos;
using SmartDev.Application.Ports;
using SmartDev.Infrastructure.Options;
using SmartDev.Infrastructure.Ports;

namespace SmartDev.Api.Functions.Configuration;

public static class ApiAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCosmosServices(configuration);

        return services;
    }

    private static IServiceCollection AddCosmosServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<CosmosDbOptions>()
            .Bind(configuration.GetSection(CosmosDbOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton(sp => {
            var options = sp.GetRequiredService<IOptions<CosmosDbOptions>>().Value;
            return new CosmosClient(options.ConnectionString);
        });

        services.AddSingleton<IDocumentStore, CosmosDocumentStore>();

        return services;
    }
}
