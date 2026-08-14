using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Contact;

/// <summary>
/// Raised when a contact message is submitted and should be delivered by email.
/// </summary>
/// <param name="ContactMessageId">The submitted contact message identifier.</param>
/// <param name="SenderName">The name supplied by the sender.</param>
/// <param name="SenderEmail">The email address supplied by the sender.</param>
/// <param name="Message">The submitted message body.</param>
/// <param name="OccurredAt">The time the contact message was submitted.</param>
public sealed record ContactMessageCreatedEvent(
    ContactMessageId ContactMessageId,
    string SenderName,
    string SenderEmail,
    string Message,
    DateTimeOffset OccurredAt) : IDomainEvent;
