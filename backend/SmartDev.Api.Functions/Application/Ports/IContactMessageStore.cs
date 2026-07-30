using SmartDev.Api.Functions.Domain.Contact;

namespace SmartDev.Api.Functions.Application.Ports;

/// <summary>
/// Persists contact messages and their email delivery state.
/// </summary>
public interface IContactMessageStore
{
    /// <summary>
    /// Saves a newly submitted contact message.
    /// </summary>
    /// <param name="contactMessage">The contact message aggregate to persist.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task SaveAsync(ContactMessage contactMessage, CancellationToken cancellationToken);

    /// <summary>
    /// Marks a contact message email as sent.
    /// </summary>
    /// <param name="contactMessageId">The identifier of the contact message to update.</param>
    /// <param name="sentAt">The date and time the email was sent.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task MarkEmailSentAsync(ContactMessageId contactMessageId, DateTimeOffset sentAt, CancellationToken cancellationToken);

    /// <summary>
    /// Marks a contact message email as failed.
    /// </summary>
    /// <param name="contactMessageId">The identifier of the contact message to update.</param>
    /// <param name="failureReason">The reason the email delivery failed.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task MarkEmailFailedAsync(ContactMessageId contactMessageId, string failureReason, CancellationToken cancellationToken);
}
