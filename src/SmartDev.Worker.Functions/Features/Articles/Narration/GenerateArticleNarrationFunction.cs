using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;
using SmartDev.Worker.Functions.Common.Application;

namespace SmartDev.Worker.Functions.Features.Articles.Narration;

public sealed class GenerateArticleNarrationFunction(GenerateArticleNarrationHandler handler, ILogger<GenerateArticleNarrationFunction> logger)
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    [Function(nameof(GenerateArticleNarrationFunction))]
    public async Task Run(
        [ServiceBusTrigger(WorkerTopology.ArticleNarrationRequestedQueue, Connection = AzureServiceBusOptions.SectionName)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        try {
            var narrationRequest = JsonSerializer.Deserialize<ArticleNarrationRequestedIntegrationEvent>(message.Body.ToString(), SerializerOptions)
                ?? throw new InvalidOperationException($"Unable to deserialize {nameof(ArticleNarrationRequestedIntegrationEvent)}.");

            await handler.HandleAsync(narrationRequest, cancellationToken);

            logger.LogInformation(
                "Article narration request processed successfully. ArticleId: {ArticleId}. ContentVersion: {ContentVersion}.",
                narrationRequest.ArticleId,
                narrationRequest.ContentVersion);
        } catch (Exception exception) {
            logger.LogError(
                exception,
                "Article narration request processing failed. QueueName: {QueueName}. MessageId: {MessageId}. DeliveryCount: {DeliveryCount}.",
                WorkerTopology.ArticleNarrationRequestedQueue,
                message.MessageId,
                message.DeliveryCount);

            throw;
        }
    }
}
