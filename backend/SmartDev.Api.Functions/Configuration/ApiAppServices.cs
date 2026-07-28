using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Azure.Cosmos;
using MassTransit;
using SmartDev.Application.Ports;
using SmartDev.Infrastructure.Messaging;
using SmartDev.Infrastructure.Messaging.Handlers;
using SmartDev.Infrastructure.Options;
using SmartDev.Infrastructure.Ports;

namespace SmartDev.Api.Functions.Configuration;

public static class ApiAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddCosmosServices(configuration)
            .AddDomainEventServices()
            .AddMessagingServices(configuration);

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

    private static IServiceCollection AddDomainEventServices(this IServiceCollection services)
    {
        services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();
        services.AddScoped<IIntegrationEventPublisher, IntegrationEventPublisher>();
        services.AddScoped<IDomainEventHandler, ContactMessageCreatedHandler>();

        return services;
    }

    private static IServiceCollection AddMessagingServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<AzureServiceBusOptions>()
            .Bind(configuration.GetSection(AzureServiceBusOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddMassTransit(configurator => {
            configurator.UsingAzureServiceBus((context, busFactoryConfigurator) => {
                var options = context.GetRequiredService<IOptions<AzureServiceBusOptions>>().Value;

                busFactoryConfigurator.Host(options.ConnectionString);
                busFactoryConfigurator.DeployPublishTopology = false;
                busFactoryConfigurator.Message<ContactMessageCreatedModel>(messageConfigurator =>
                    messageConfigurator.SetEntityName(ContactMessagingTopology.ContactMessageCreatedTopic));
            });
        });

        return services;
    }
}
