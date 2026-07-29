using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Application.Messaging;

public sealed class DomainEventDispatcher(IEnumerable<IDomainEventHandler> domainEventHandlers) : IDomainEventDispatcher
{
    private readonly IReadOnlyDictionary<Type, IReadOnlyList<IDomainEventHandler>> _handlersByEventType = domainEventHandlers
        .GroupBy(handler => handler.EventType)
        .ToDictionary(group => group.Key, group => (IReadOnlyList<IDomainEventHandler>)group.ToList());

    public async Task DispatchAsync(IReadOnlyCollection<IDomainEvent> domainEvents, CancellationToken cancellationToken)
    {
        foreach (var domainEvent in domainEvents) {
            if (!_handlersByEventType.TryGetValue(domainEvent.GetType(), out var handlers)) continue;
            foreach (var handler in handlers) await handler.HandleAsync(domainEvent, cancellationToken);
        }
    }
}
