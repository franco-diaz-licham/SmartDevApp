using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartDev.Application.Ports;
using SmartDev.Infrastructure.Options;
using SmartDev.Infrastructure.Ports;

namespace SmartDev.Infrastructure.Configuration;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCosmosDocumentStore(configuration);
        services.AddAzureCommunicationEmail(configuration);

        return services;
    }

    public static IServiceCollection AddCosmosDocumentStore(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<CosmosDbOptions>()
            .Bind(configuration.GetSection(CosmosDbOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton(sp => {
            var options = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<CosmosDbOptions>>().Value;
            return new CosmosClient(options.ConnectionString);
        });

        services.AddSingleton<IDocumentStore, CosmosDocumentStore>();

        return services;
    }

    public static IServiceCollection AddAzureCommunicationEmail(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<AzureCommunicationServiceOptions>()
            .Bind(configuration.GetSection(AzureCommunicationServiceOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<IEmailSender, AzureCommunicationEmailSender>();

        return services;
    }
}
