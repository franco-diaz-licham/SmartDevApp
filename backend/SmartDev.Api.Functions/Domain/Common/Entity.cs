namespace SmartDev.Api.Functions.Domain.Common;

/// <summary>
/// Base type for aggregate roots and entities that carry an identity and domain events.
/// </summary>
/// <typeparam name="TId">The strongly typed entity identifier.</typeparam>
public abstract class Entity<TId>
    where TId : notnull
{
    private readonly List<IDomainEvent> _domainEvents = [];

    /// <summary>
    /// Creates a new entity with the current UTC time as the creation time.
    /// </summary>
    protected Entity(TId id) : this(id, DateTimeOffset.UtcNow, updatedAt: null)
    {
    }

    /// <summary>
    /// Rehydrates an entity with persisted creation and update timestamps.
    /// </summary>
    protected Entity(TId id, DateTimeOffset createdAt, DateTimeOffset? updatedAt)
    {
        Id = id;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    /// <summary>
    /// Gets the entity identifier.
    /// </summary>
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

    /// <summary>
    /// Removes all pending domain events from this entity.
    /// </summary>
    public void ClearDomainEvents() => _domainEvents.Clear();

    /// <summary>
    /// Adds a domain event to be dispatched after the aggregate is persisted.
    /// </summary>
    protected void RaiseDomainEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);

    /// <summary>
    /// Marks the entity as updated at the supplied time.
    /// </summary>
    protected void Touch(DateTimeOffset updatedAt) => UpdatedAt = updatedAt;
}
