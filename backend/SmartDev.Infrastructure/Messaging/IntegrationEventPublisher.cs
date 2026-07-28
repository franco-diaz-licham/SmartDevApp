using MassTransit;
using SmartDev.Application.Ports;

namespace SmartDev.Infrastructure.Messaging;

public sealed class IntegrationEventPublisher(ISendEndpointProvider sendEndpointProvider) : IIntegrationEventPublisher
{
    public async Task PublishAsync<TIntegrationEventModel>(
        TIntegrationEventModel integrationEventModel,
        CancellationToken cancellationToken = default)
        where TIntegrationEventModel : class
    {
        var endpoint = await sendEndpointProvider.GetSendEndpoint(ContactMessagingTopology.ContactMessageCreatedQueueUri);
        await endpoint.Send(integrationEventModel, cancellationToken);
    }
}
