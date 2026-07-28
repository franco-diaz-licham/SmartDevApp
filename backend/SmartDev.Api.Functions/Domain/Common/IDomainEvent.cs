namespace SmartDev.Api.Functions.Domain.Common;

public interface IDomainEvent
{
    DateTimeOffset OccurredAt { get; }
}
