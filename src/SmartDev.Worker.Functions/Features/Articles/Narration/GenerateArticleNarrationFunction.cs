using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;

namespace SmartDev.Worker.Functions.Features.Articles.Narration;

public sealed class GenerateArticleNarrationFunction(GenerateArticleNarrationHandler handler, ILogger<GenerateArticleNarrationFunction> logger)
{
    [Function(nameof(GenerateArticleNarrationFunction))]
    public async Task Run(
        [ServiceBusTrigger(WorkerTopology.ArticleNarrationRequestedQueue, Connection = AzureServiceBusOptions.SectionName)]
        ArticleNarrationRequestedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        try {
            logger.LogInformation(
                "Article narration request received. QueueName: {QueueName}. ArticleId: {ArticleId}. ContentVersion: {ContentVersion}.",
                WorkerTopology.ArticleNarrationRequestedQueue,
                message.ArticleId,
                message.ContentVersion);

            await handler.HandleAsync(message, cancellationToken);

            logger.LogInformation(
                "Article narration request processed successfully. ArticleId: {ArticleId}. ContentVersion: {ContentVersion}.",
                message.ArticleId,
                message.ContentVersion);
        } catch (Exception exception) {
            logger.LogError(
                exception,
                "Article narration request processing failed. QueueName: {QueueName}. ArticleId: {ArticleId}. ContentVersion: {ContentVersion}.",
                WorkerTopology.ArticleNarrationRequestedQueue,
                message.ArticleId,
                message.ContentVersion);

            throw;
        }
    }
}

