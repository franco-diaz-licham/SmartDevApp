using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartDev.Api.Functions.Application.Ports;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

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
            NoteDocument.ContainerName,
            NoteDocument.PartitionKeyPath,
            defaultTimeToLiveSeconds: null,
            cancellationToken: stoppingToken);

        logger.LogInformation("Cosmos DB document containers are ready");
    }
}
