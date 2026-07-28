using SmartDev.Domain.Common;

namespace SmartDev.Application.Ports;

/// <summary>
/// Handles one domain event type inside the current unit of work.
/// </summary>
public interface IDomainEventHandler
{
    /// <summary>
    /// The domain event type this handler accepts.
    /// </summary>
    Type EventType { get; }

    /// <summary>
    /// Handles the domain event.
    /// </summary>
    Task HandleAsync(IDomainEvent domainEvent, CancellationToken cancellationToken);
}
