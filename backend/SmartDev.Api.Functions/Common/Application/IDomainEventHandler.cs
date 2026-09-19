using SmartDev.Api.Functions.Common.Domain;

namespace SmartDev.Api.Functions.Common.Application;

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




