using SmartDev.Domain.Common;

namespace SmartDev.Application.Ports;

/// <summary>
/// Dispatches domain events raised by aggregates during the current unit of work.
/// </summary>
/// <remarks>
/// Infrastructure implementations can translate domain events into integration events, notifications,
/// or other side effects. When the implementation uses an outbox, dispatch should happen before the
/// unit of work commits so outbox messages are persisted with the aggregate changes.
/// </remarks>
public interface IDomainEventDispatcher
{
    /// <summary>
    /// Dispatches the collected domain events.
    /// </summary>
    Task DispatchAsync(IReadOnlyCollection<IDomainEvent> domainEvents, CancellationToken cancellationToken);
}
