using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;
using SmartDev.Worker.Functions.Application.UsesCases;

namespace SmartDev.Worker.Functions.Functions;

public sealed class SendContactEmailFunction(
    SendContactEmailHandler handler,
    ILogger<SendContactEmailFunction> logger)
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    [Function(nameof(SendContactEmailFunction))]
    public async Task Run(
        [ServiceBusTrigger(ContactMessagingTopology.ContactMessageCreatedQueue, Connection = AzureServiceBusOptions.SectionName)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        try {
            var contactMessage = JsonSerializer.Deserialize<ContactMessageCreatedIntegrationEvent>(message.Body.ToString(), SerializerOptions)
                ?? throw new InvalidOperationException($"Unable to deserialize {nameof(ContactMessageCreatedIntegrationEvent)}.");

            await handler.HandleAsync(contactMessage, cancellationToken);

            logger.LogInformation(
                "Contact email message processed successfully. ContactMessageId: {ContactMessageId}.",
                contactMessage.ContactMessageId);
        } catch (Exception exception) {
            logger.LogError(
                exception,
                "Contact email message processing failed. QueueName: {QueueName}. MessageId: {MessageId}. DeliveryCount: {DeliveryCount}.",
                ContactMessagingTopology.ContactMessageCreatedQueue,
                message.MessageId,
                message.DeliveryCount);

            throw;
        }
    }
}
