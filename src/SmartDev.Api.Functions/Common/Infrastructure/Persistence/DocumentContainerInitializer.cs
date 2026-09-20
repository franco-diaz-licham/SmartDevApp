using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Infrastructure.Persistence;
using SmartDev.Api.Functions.Features.Contact.Infrastructure.Persistence;
using SmartDev.Api.Functions.Features.Journal.Infrastructure.Persistence;

namespace SmartDev.Api.Functions.Common.Infrastructure.Persistence;

public sealed class DocumentContainerInitializer(IDocumentStore documentStore, ILogger<DocumentContainerInitializer> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Ensuring Cosmos DB document containers exist");

        await documentStore.EnsureContainerAsync(
            ContactMessageDocument.ContainerName,
            ContactMessageDocument.PartitionKeyPath,
            cancellationToken: stoppingToken);

        await documentStore.EnsureContainerAsync(
            ArticleDocument.ContainerName,
            ArticleDocument.PartitionKeyPath,
            timeToLive: DocumentContainerTimeToLive.Disabled,
            cancellationToken: stoppingToken);

        await documentStore.EnsureContainerAsync(
            JournalEntryDocument.ContainerName,
            JournalEntryDocument.PartitionKeyPath,
            timeToLive: DocumentContainerTimeToLive.Disabled,
            cancellationToken: stoppingToken);

        logger.LogInformation("Cosmos DB document containers are ready");
    }
}
