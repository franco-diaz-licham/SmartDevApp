using SmartDev.Application.Ports;
using SmartDev.Domain.Common;
using SmartDev.Domain.Contact;

namespace SmartDev.Infrastructure.Messaging.Handlers;

public sealed class ContactMessageCreatedHandler(IIntegrationEventPublisher integrationEventPublisher) : IDomainEventHandler
{
    public Type EventType => typeof(ContactMessageCreated);

    public async Task HandleAsync(IDomainEvent domainEvent, CancellationToken cancellationToken = default)
    {
        if (domainEvent is not ContactMessageCreated) throw new InvalidOperationException($"{nameof(ContactMessageCreatedHandler)} cannot handle {domainEvent.GetType().Name}.");
        var emailEvent = (ContactMessageCreated)domainEvent;

        await integrationEventPublisher.PublishAsync(
            new ContactMessageCreatedModel(
                ContactMessageId: emailEvent.ContactMessageId.Value,
                SenderName: emailEvent.SenderName,
                SenderEmail: emailEvent.SenderEmail,
                Message: emailEvent.Message,
                OccurredAt: emailEvent.OccurredAt),
            cancellationToken);
    }
}
