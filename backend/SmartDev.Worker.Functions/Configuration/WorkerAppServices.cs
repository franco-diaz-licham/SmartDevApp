using Azure.Messaging.ServiceBus;
using Azure.Messaging.ServiceBus.Administration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MassTransit;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;
using SmartDev.Worker.Functions.Application.Ports;
using SmartDev.Worker.Functions.Infrastructure.Email;
using SmartDev.Worker.Functions.Infrastructure.Messaging;
using SmartDev.Worker.Functions.Infrastructure.Options;
using SmartDev.Worker.Functions.Application.UsesCases;

namespace SmartDev.Worker.Functions.Configuration;

public static class WorkerAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddApplicationServices()
            .AddEmailServices(configuration)
            .AddContactEmailServices(configuration)
            .AddMessagingServices(configuration);

        return services;
    }

    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<SendContactEmailHandler>();
        services.AddScoped<IIntegrationEventPublisher, IntegrationEventPublisher>();

        return services;
    }

    private static IServiceCollection AddEmailServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<AzureCommunicationServiceOptions>()
            .Bind(configuration.GetSection(AzureCommunicationServiceOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<IEmailSender, AzureCommunicationEmailSender>();

        return services;
    }

    private static IServiceCollection AddContactEmailServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<ContactEmailOptions>()
            .Bind(configuration.GetSection(ContactEmailOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        return services;
    }

    private static IServiceCollection AddMessagingServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<AzureServiceBusOptions>()
            .Bind(configuration.GetSection(AzureServiceBusOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddMassTransitForAzureFunctions(
            configurator => {
                configurator.AddConsumersFromNamespaceContaining<ConsumerAnchor>();
            },
            AzureServiceBusOptions.ConnectionStringAppSettingName,
            (context, busFactoryConfigurator) => {
                var options = context.GetRequiredService<IOptions<AzureServiceBusOptions>>().Value;
                var administrationConnectionString = string.IsNullOrWhiteSpace(options.AdministrationConnectionString)
                    ? options.ConnectionString
                    : options.AdministrationConnectionString;

                var serviceBusClient = new ServiceBusClient(options.ConnectionString);
                var administrationClient = new ServiceBusAdministrationClient(administrationConnectionString);

                busFactoryConfigurator.Host(
                    ServiceBusConnectionStringProperties.Parse(options.ConnectionString).Endpoint,
                    serviceBusClient,
                    administrationClient);
                busFactoryConfigurator.DeployPublishTopology = false;
                busFactoryConfigurator.PrefetchCount = options.PrefetchCount ?? 1;
                busFactoryConfigurator.ConcurrentMessageLimit = options.ConcurrentMessageLimit ?? 1;
                busFactoryConfigurator.UseMessageRetry(retryConfigurator => retryConfigurator.None());
                busFactoryConfigurator.UseTimeout(timeoutConfigurator => {
                    timeoutConfigurator.Timeout = TimeSpan.FromSeconds(options.TimeoutSeconds ?? 60);
                });
            });

        return services;
    }
}
