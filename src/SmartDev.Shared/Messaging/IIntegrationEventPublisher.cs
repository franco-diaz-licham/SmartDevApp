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
    /// <summary>
    /// Publishes an integration event model to its configured message endpoint.
    /// </summary>
    /// <typeparam name="TIntegrationEventModel">The integration event model type.</typeparam>
    /// <param name="integrationEventModel">The integration event model to publish.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task PublishAsync<TIntegrationEventModel>(TIntegrationEventModel integrationEventModel, CancellationToken cancellationToken = default)
        where TIntegrationEventModel : class;
}

/// <summary>
/// Handles an integration event consumed from the message bus.
/// </summary>
public interface IIntegrationEventHandler<TIntegrationEvent>
    where TIntegrationEvent : IIntegrationEvent
{
    /// <summary>
    /// Handles an integration event consumed from the message bus.
    /// </summary>
    /// <param name="integrationEvent">The integration event to handle.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task HandleAsync(TIntegrationEvent integrationEvent, CancellationToken cancellationToken);
}
