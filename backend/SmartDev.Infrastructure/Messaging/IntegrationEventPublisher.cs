using MassTransit;
using SmartDev.Application.Ports;

namespace SmartDev.Infrastructure.Messaging;

/// <summary>
/// Publishes integration events through MassTransit.
/// </summary>
/// <remarks>
/// In the API host this runs behind MassTransit's EF Bus Outbox, so publishes made during a unit of
/// work are stored with the same DbContext transaction and delivered by MassTransit after commit.
/// </remarks>
public sealed class IntegrationEventPublisher(IPublishEndpoint publishEndpoint) : IIntegrationEventPublisher
{
    public async Task PublishAsync<TIntegrationEventModel>(
        TIntegrationEventModel integrationEventModel,
        CancellationToken cancellationToken = default)
        where TIntegrationEventModel : class
    {
        await publishEndpoint.Publish(integrationEventModel, cancellationToken);
    }
}
