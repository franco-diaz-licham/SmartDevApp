using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;
using SmartDev.Worker.Functions.Application.Ports;
using SmartDev.Worker.Functions.Infrastructure.Email;
using SmartDev.Worker.Functions.Infrastructure.Options;
using SmartDev.Worker.Functions.Application.UsesCases;

namespace SmartDev.Worker.Functions.Configuration;

public static class WorkerAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services
            .AddApplicationServices()
            .AddEmailServices(configuration, environment)
            .AddContactEmailServices(configuration)
            .AddMessagingServices(configuration);

        return services;
    }

    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IIntegrationEventPublisher, IntegrationEventPublisher>();

        services.AddScoped<SendContactEmailHandler>();

        return services;
    }

    private static IServiceCollection AddEmailServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        if (environment.IsDevelopment()) {
            services.AddSingleton<IEmailSender, LocalEmailSender>();
            return services;
        }

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

        services.AddSingleton(_ => new ServiceBusClient(configuration[AzureServiceBusOptions.SectionName]));

        return services;
    }
}
