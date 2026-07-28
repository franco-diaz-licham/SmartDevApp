using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Azure.Cosmos;
using MassTransit;
using SmartDev.Api.Functions.Application.Messaging;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Configuration.Options;
using SmartDev.Api.Functions.Functions;
using SmartDev.Shared.Messaging;
using SmartDev.Api.Functions.Application.Messaging.Handlers;
using SmartDev.Api.Functions.Infrastructure.Options;
using SmartDev.Api.Functions.Infrastructure.Persistence;
using SmartDev.Shared.Options;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Configuration;

public static class ApiAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddCorsServices(configuration)
            .AddApplicationServices()
            .AddCosmosServices(configuration)
            .AddDomainEventServices()
            .AddApiMessagingServices(configuration);

        return services;
    }

    private static IServiceCollection AddCorsServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<CorsOptions>()
            .Bind(configuration.GetSection(CorsOptions.SectionName))
            .ValidateOnStart();

        services.AddSingleton<HttpCorsHeaders>();

        return services;
    }

    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<CreateContactEmailHandler>();

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
        services.AddScoped<IContactMessageStore, CosmosContactMessageStore>();

        return services;
    }

    private static IServiceCollection AddDomainEventServices(this IServiceCollection services)
    {
        services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();
        services.AddScoped<IIntegrationEventPublisher, IntegrationEventPublisher>();
        services.AddScoped<IDomainEventHandler, ContactMessageCreatedHandler>();

        return services;
    }

    private static IServiceCollection AddApiMessagingServices(this IServiceCollection services, IConfiguration configuration)
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
            });
        });

        return services;
    }
}
