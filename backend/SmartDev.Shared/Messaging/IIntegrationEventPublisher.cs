namespace SmartDev.Shared.Messaging;

/// <summary>
/// Publishes integration events through the configured messaging boundary.
/// </summary>
/// <remarks>
/// Production infrastructure should persist these messages through an outbox when publishing from
/// request or command handling code, so database changes and outgoing messages remain consistent.
/// </remarks>
public interface IIntegrationEventPublisher
{
    Task PublishAsync<TIntegrationEventModel>(TIntegrationEventModel integrationEventModel, CancellationToken cancellationToken = default)
        where TIntegrationEventModel : class;
}

/// <summary>
/// Handles an integration event consumed from the message bus.
/// </summary>
public interface IIntegrationEventHandler<TIntegrationEvent>
    where TIntegrationEvent : IIntegrationEvent
{
    Task HandleAsync(TIntegrationEvent integrationEvent, CancellationToken cancellationToken);
}
