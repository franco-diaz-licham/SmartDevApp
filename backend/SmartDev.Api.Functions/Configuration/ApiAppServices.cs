using Azure.Messaging.ServiceBus;
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

        services.AddScoped<CreateContactEmailHandler>();
        services.AddScoped<UpdateContactEmailStatusHandler>();
        services.AddScoped<GetPublicNotesHandler>();
        services.AddScoped<GetOwnerNotesHandler>();
        services.AddScoped<GetPublicNoteBySlugHandler>();
        services.AddScoped<GetPublicNoteCategoriesHandler>();
        services.AddScoped<GetPublicNoteTagsHandler>();
        services.AddScoped<SearchPublicNotesHandler>();
        services.AddScoped<GetPublicNoteSearchIndexHandler>();
        services.AddScoped<CreateNoteHandler>();
        services.AddScoped<UpdateNoteHandler>();

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
        services.AddScoped<INoteRepository, CosmosNoteRepository>();

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
