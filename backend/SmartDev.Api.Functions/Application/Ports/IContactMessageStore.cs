using SmartDev.Api.Functions.Domain.Contact;

namespace SmartDev.Api.Functions.Application.Ports;

public interface IContactMessageStore
{
    Task SaveAsync(ContactMessage contactMessage, CancellationToken cancellationToken);

    Task MarkEmailSentAsync(ContactMessageId contactMessageId, DateTimeOffset sentAt, CancellationToken cancellationToken);

    Task MarkEmailFailedAsync(ContactMessageId contactMessageId, string failureReason, CancellationToken cancellationToken);
}
