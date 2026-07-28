using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MassTransit;
using SmartDev.Application.Ports;
using SmartDev.Infrastructure.Messaging;
using SmartDev.Infrastructure.Options;
using SmartDev.Infrastructure.Ports;
using SmartDev.Worker.Functions.Messaging;
using SmartDev.Worker.Functions.Configuration.Options;

namespace SmartDev.Worker.Functions.Configuration;

public static class WorkerAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddEmailServices(configuration)
            .AddContactEmailServices(configuration)
            .AddMessagingServices(configuration);

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
            AzureServiceBusOptions.ConnectionStringConfigurationKey,
            (context, busFactoryConfigurator) => {
                var options = context.GetRequiredService<IOptions<AzureServiceBusOptions>>().Value;

                busFactoryConfigurator.DeployPublishTopology = false;
                busFactoryConfigurator.Message<ContactMessageCreatedModel>(messageConfigurator =>
                    messageConfigurator.SetEntityName(ContactMessagingTopology.ContactMessageCreatedTopic));
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
