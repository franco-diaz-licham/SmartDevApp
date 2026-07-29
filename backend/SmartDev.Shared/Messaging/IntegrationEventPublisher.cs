using MassTransit;

namespace SmartDev.Shared.Messaging;

public sealed class IntegrationEventPublisher(ISendEndpointProvider sendEndpointProvider) : IIntegrationEventPublisher
{
    public async Task PublishAsync<TIntegrationEventModel>(
        TIntegrationEventModel integrationEventModel,
        CancellationToken cancellationToken = default)
        where TIntegrationEventModel : class
    {
        var endpointUri = GetEndpointUri<TIntegrationEventModel>();
        var endpoint = await sendEndpointProvider.GetSendEndpoint(endpointUri);
        await endpoint.Send(integrationEventModel, cancellationToken);
    }

    private static Uri GetEndpointUri<TIntegrationEventModel>()
        where TIntegrationEventModel : class
    {
        return typeof(TIntegrationEventModel) switch {
            var type when type == typeof(ContactMessageCreatedModel) => ContactMessagingTopology.ContactMessageCreatedQueueUri,
            var type when type == typeof(ContactEmailDeliveryResultModel) => ContactMessagingTopology.ContactEmailDeliveryResultQueueUri,
            _ => throw new InvalidOperationException($"No Service Bus endpoint configured for {typeof(TIntegrationEventModel).Name}.")
        };
    }
}
