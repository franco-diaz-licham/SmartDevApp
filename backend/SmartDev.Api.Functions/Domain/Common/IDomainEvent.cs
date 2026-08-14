namespace SmartDev.Api.Functions.Domain.Common;

/// <summary>
/// Represents a domain occurrence raised by an aggregate for application-level handling.
/// </summary>
public interface IDomainEvent
{
    /// <summary>
    /// Gets when the domain event occurred.
    /// </summary>
    DateTimeOffset OccurredAt { get; }
}
