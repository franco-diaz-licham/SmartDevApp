using SmartDev.Shared.Infrastructure.Text;
using SmartDev.Shared.Infrastructure.Storage;
using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Azure.Cosmos;
using SmartDev.Api.Functions.Application.Messaging;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Configuration.Options;
using SmartDev.Shared.Messaging;
using SmartDev.Api.Functions.Application.Messaging.Handlers;
using SmartDev.Api.Functions.Infrastructure.Persistence;
using SmartDev.Shared.Options;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Configuration.Middleware;
using SmartDev.Api.Functions.Infrastructure.Auth;

namespace SmartDev.Api.Functions.Configuration;

public static class ApiAppServices
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services
            .AddMiddlewareServices(configuration)
            .AddApplicationServices()
            .AddArticleAudioServices(configuration)
            .AddCosmosServices(configuration, environment)
            .AddApiMessagingServices(configuration);

        return services;
    }

    private static IServiceCollection AddMiddlewareServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddOptions<CorsOptions>()
            .Bind(configuration.GetSection(CorsOptions.SectionName))
            .ValidateOnStart();

        services
            .AddOptions<RateLimitingOptions>()
            .Bind(configuration.GetSection(RateLimitingOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services
            .AddOptions<EntraIdOptions>()
            .Bind(configuration.GetSection(EntraIdOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<HttpCorsHeaders>();
        services.AddSingleton<HttpRateLimiter>();
        services.AddSingleton<IAccessTokenValidator, EntraAccessTokenValidator>();
        services.AddSingleton<IAdminAccessAuthorizer, AdminAccessAuthorizer>();

        return services;
    }

    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();
        services.AddScoped<IIntegrationEventPublisher, IntegrationEventPublisher>();
        services.AddScoped<IDomainEventHandler, ContactMessageCreatedHandler>();
        services.AddScoped<IDomainEventHandler, ArticleNarrationRequestedHandler>();
        services.AddSingleton<IMarkdownTextConverter, MarkdownTextConverter>();

        services.AddScoped<CreateContactEmailHandler>();
        services.AddScoped<UpdateContactEmailStatusHandler>();
        services.AddScoped<ArticlesQueryHandler>();
        services.AddScoped<ArticlesCommandHandler>();

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

    private static IServiceCollection AddCosmosServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services
            .AddOptions<CosmosDbOptions>()
            .Bind(configuration.GetSection(CosmosDbOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();


        services.AddSingleton(sp => {
            var options = sp.GetRequiredService<IOptions<CosmosDbOptions>>().Value;
            var clientOptions = new CosmosClientOptions {
                ConnectionMode = ConnectionMode.Gateway,
                LimitToEndpoint = environment.IsDevelopment(),
                SerializerOptions = new CosmosSerializationOptions {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                },
                CosmosClientTelemetryOptions = new CosmosClientTelemetryOptions {
                    DisableDistributedTracing = false
                }
            };

            if (environment.IsDevelopment()) {
                clientOptions.HttpClientFactory = () => new HttpClient(new HttpClientHandler {
                    ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                });
            }

            return new CosmosClient(options.ConnectionString, clientOptions);
        });

        services.AddSingleton<IDocumentStore, CosmosDocumentStore>();
        services.AddHostedService<DocumentContainerInitializer>();
        services.AddScoped<IContactMessageStore, CosmosContactMessageStore>();
        services.AddScoped<IArticleRepository, CosmosArticleRepository>();

        return services;
    }

    private static IServiceCollection AddApiMessagingServices(this IServiceCollection services, IConfiguration configuration)
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

