using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;

namespace SmartDev.Api.Functions.Functions;

public sealed class UpdateContactEmailStatusFunction(UpdateContactEmailStatusHandler handler, ILogger<UpdateContactEmailStatusFunction> logger)
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    [Function(nameof(UpdateContactEmailStatusFunction))]
    public async Task Run(
        [ServiceBusTrigger(ContactMessagingTopology.ContactEmailDeliveryResultQueue, Connection = AzureServiceBusOptions.SectionName)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        try {
            var result = JsonSerializer.Deserialize<ContactEmailDeliveryResultModel>(message.Body.ToString(), SerializerOptions)
                ?? throw new InvalidOperationException($"Unable to deserialize {nameof(ContactEmailDeliveryResultModel)}.");

            await handler.HandleAsync(result, cancellationToken);
            logger.LogInformation("Contact email delivery result processed successfully. ContactMessageId: {ContactMessageId}. Status: {Status}.", result.ContactMessageId, result.Status);
        } catch (Exception exception) {
            logger.LogError(
                exception,
                "Contact email delivery result processing failed. QueueName: {QueueName}. MessageId: {MessageId}. DeliveryCount: {DeliveryCount}.",
                ContactMessagingTopology.ContactEmailDeliveryResultQueue,
                message.MessageId,
                message.DeliveryCount);

            throw;
        }
    }
}
