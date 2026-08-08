using System.Text.Json;
using Azure.Messaging.ServiceBus;

namespace SmartDev.Shared.Messaging;

public sealed class IntegrationEventPublisher(ServiceBusClient serviceBusClient) : IIntegrationEventPublisher
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task PublishAsync<TIntegrationEventModel>(
        TIntegrationEventModel integrationEventModel,
        CancellationToken cancellationToken = default)
        where TIntegrationEventModel : class
    {
        var queueName = GetQueueName<TIntegrationEventModel>();
        var sender = serviceBusClient.CreateSender(queueName);
        var body = JsonSerializer.SerializeToUtf8Bytes(integrationEventModel, SerializerOptions);
        var message = new ServiceBusMessage(body) {
            ContentType = "application/json",
            Subject = typeof(TIntegrationEventModel).Name,
            MessageId = CreateMessageId(integrationEventModel),
            CorrelationId = GetCorrelationId(integrationEventModel)
        };

        await sender.SendMessageAsync(message, cancellationToken);
    }

    private static string GetQueueName<TIntegrationEventModel>()
        where TIntegrationEventModel : class
    {
        return typeof(TIntegrationEventModel) switch {
            var type when type == typeof(ContactMessageCreatedIntegrationEvent) => ContactMessagingTopology.ContactMessageCreatedQueue,
            var type when type == typeof(ContactEmailDeliveryResultModel) => ContactMessagingTopology.ContactEmailDeliveryResultQueue,
            _ => throw new InvalidOperationException($"No Service Bus endpoint configured for {typeof(TIntegrationEventModel).Name}.")
        };
    }

    private static string CreateMessageId<TIntegrationEventModel>(TIntegrationEventModel integrationEventModel)
        where TIntegrationEventModel : class
    {
        return integrationEventModel switch {
            ContactMessageCreatedIntegrationEvent message => $"{nameof(ContactMessageCreatedIntegrationEvent)}-{message.ContactMessageId:N}",
            ContactEmailDeliveryResultModel result => $"{nameof(ContactEmailDeliveryResultModel)}-{result.ContactMessageId:N}-{result.Status}",
            _ => Guid.NewGuid().ToString("N")
        };
    }

    private static string? GetCorrelationId<TIntegrationEventModel>(TIntegrationEventModel integrationEventModel)
        where TIntegrationEventModel : class
    {
        return integrationEventModel switch {
            ContactMessageCreatedIntegrationEvent message => message.ContactMessageId.ToString("N"),
            ContactEmailDeliveryResultModel result => result.ContactMessageId.ToString("N"),
            _ => null
        };
    }
}
