namespace SmartDev.Domain.Common;

public interface IDomainEvent
{
    DateTimeOffset OccurredAt { get; }
}
