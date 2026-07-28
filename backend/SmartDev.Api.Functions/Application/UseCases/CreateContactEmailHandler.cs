using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Contact;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed record CreateContactEmailCommand(
    string Name,
    string Email,
    string Message);

public sealed record CreateContactEmailResult(Guid ContactMessageId);


public sealed class CreateContactEmailHandler(
    IContactMessageStore contactMessageStore,
    IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<CreateContactEmailResult> HandleAsync(
        CreateContactEmailCommand command,
        CancellationToken cancellationToken)
    {
        var contactMessage = ContactMessage.Create(
            command.Name,
            command.Email,
            command.Message,
            DateTimeOffset.UtcNow);

        await contactMessageStore.SaveAsync(contactMessage, cancellationToken);
        await domainEventDispatcher.DispatchAsync(contactMessage.DomainEvents, cancellationToken);
        contactMessage.ClearDomainEvents();

        return new CreateContactEmailResult(contactMessage.Id.Value);
    }
}
