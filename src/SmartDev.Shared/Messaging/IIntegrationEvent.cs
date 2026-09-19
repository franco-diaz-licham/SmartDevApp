
namespace SmartDev.Shared.Messaging;

/// <summary>
/// Contract for messages published outside a service boundary.
/// </summary>
public interface IIntegrationEvent
{
    /// <summary>
    /// Gets the integration event identifier.
    /// </summary>
    Guid Id { get; }

    /// <summary>
    /// Gets the date and time the integration event occurred.
    /// </summary>
    DateTimeOffset OccurredAt { get; }
}
