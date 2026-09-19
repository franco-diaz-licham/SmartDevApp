using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Contact.Contracts;
using SmartDev.Api.Functions.Common.Domain;
using SmartDev.Api.Functions.Features.Contact.Domain;
using SmartDev.Shared.Messaging;

namespace SmartDev.Api.Functions.Features.Contact.Messaging;

public sealed class ContactMessageCreatedHandler(IIntegrationEventPublisher integrationEventPublisher) : IDomainEventHandler
{
    public Type EventType => typeof(ContactMessageCreatedEvent);

    public async Task HandleAsync(IDomainEvent domainEvent, CancellationToken cancellationToken = default)
    {
        if (domainEvent is not ContactMessageCreatedEvent) throw new InvalidOperationException($"{nameof(ContactMessageCreatedHandler)} cannot handle {domainEvent.GetType().Name}.");
        var emailEvent = (ContactMessageCreatedEvent)domainEvent;

        await integrationEventPublisher.PublishAsync(
            new ContactMessageCreatedIntegrationEvent(
                ContactMessageId: emailEvent.ContactMessageId.Value,
                SenderName: emailEvent.SenderName,
                SenderEmail: emailEvent.SenderEmail,
                Message: emailEvent.Message,
                OccurredAt: emailEvent.OccurredAt),
            cancellationToken);
    }
}




