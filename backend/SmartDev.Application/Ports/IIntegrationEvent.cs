
namespace SmartDev.Application.Ports;

/// <summary>
/// Contract for messages published outside a service boundary.
/// </summary>
public interface IIntegrationEvent
{
    Guid Id { get; }
    DateTimeOffset OccurredAt { get; }
}
