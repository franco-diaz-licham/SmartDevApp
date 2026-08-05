namespace SmartDev.Api.Functions.Domain.Common;

public abstract class Entity<TId>
    where TId : notnull
{
    private readonly List<IDomainEvent> _domainEvents = [];

    protected Entity(TId id) : this(id, DateTimeOffset.UtcNow, updatedAt: null)
    {
    }

    protected Entity(TId id, DateTimeOffset createdAt, DateTimeOffset? updatedAt)
    {
        Id = id;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public TId Id { get; }

    /// <summary>
    /// Gets when the entity was created.
    /// </summary>
    public DateTimeOffset CreatedAt { get; }

    /// <summary>
    /// Gets when the entity was last updated, when an update has occurred.
    /// </summary>
    public DateTimeOffset? UpdatedAt { get; private set; }

    /// <summary>
    /// Gets the domain events raised by this entity.
    /// </summary>
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents;

    public void ClearDomainEvents() => _domainEvents.Clear();

    protected void RaiseDomainEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);

    protected void Touch(DateTimeOffset updatedAt) => UpdatedAt = updatedAt;
}
