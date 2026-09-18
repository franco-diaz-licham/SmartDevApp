using SmartDev.Shared.Infrastructure.Text;
using SmartDev.Shared.Infrastructure.Storage;
using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;
using SmartDev.Worker.Functions.Application.Ports;
using SmartDev.Worker.Functions.Infrastructure.Email;
using SmartDev.Worker.Functions.Infrastructure.Options;
using SmartDev.Worker.Functions.Application.UsesCases;
using SmartDev.Worker.Functions.Infrastructure.Speech;

namespace SmartDev.Worker.Functions.Configuration;

public static class WorkerAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services
            .AddApplicationServices()
            .AddEmailServices(configuration, environment)
            .AddSpeechServices(configuration, environment)
            .AddArticleAudioServices(configuration)
            .AddMessagingServices(configuration);

        return services;
    }

    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IIntegrationEventPublisher, IntegrationEventPublisher>();
        services.AddSingleton<IMarkdownTextConverter, MarkdownTextConverter>();

        services.AddScoped<SendContactEmailHandler>();
        services.AddScoped<GenerateArticleNarrationHandler>();

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

    private static IServiceCollection AddSpeechServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        if (environment.IsDevelopment()) {
            services.AddSingleton<IArticleSpeechService, LocalArticleSpeechService>();
            return services;
        }

        services
            .AddOptions<AzureSpeechOptions>()
            .Bind(configuration.GetSection(AzureSpeechOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<IArticleSpeechService, AzureArticleSpeechService>();

        return services;
    }

    private static IServiceCollection AddArticleAudioServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<ArticleAudioStorageOptions>()
            .Bind(configuration.GetSection(ArticleAudioStorageOptions.SectionName))
            .ValidateOnStart();

        services.AddSingleton(sp => sp.GetRequiredService<IOptions<ArticleAudioStorageOptions>>().Value);

        services.AddSingleton(sp => {
            var options = sp.GetRequiredService<IOptions<ArticleAudioStorageOptions>>().Value;
            var connectionString = string.IsNullOrWhiteSpace(options.ConnectionString)
                ? configuration["AzureWebJobsStorage"]
                : options.ConnectionString;

            return new BlobServiceClient(connectionString);
        });

        services.AddSingleton(sp => {
            var client = sp.GetRequiredService<BlobServiceClient>();
            var options = sp.GetRequiredService<IOptions<ArticleAudioStorageOptions>>().Value;
            var containerName = string.IsNullOrWhiteSpace(options.ContainerName)
                ? BlobStorage.DefaultContainerName
                : options.ContainerName;

            return client.GetBlobContainerClient(containerName);
        });

        services.AddSingleton<IAudioStorage, BlobStorage>();

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

