namespace SmartDev.Shared.Messaging;

/// <summary>
/// Integration event published when a contact message is submitted.
/// </summary>
/// <param name="ContactMessageId">The submitted contact message identifier.</param>
/// <param name="SenderName">The name supplied by the sender.</param>
/// <param name="SenderEmail">The email address supplied by the sender.</param>
/// <param name="Message">The submitted contact message body.</param>
/// <param name="OccurredAt">The time the contact message was submitted.</param>
public sealed record ContactMessageCreatedIntegrationEvent(
    Guid ContactMessageId,
    string SenderName,
    string SenderEmail,
    string Message,
    DateTimeOffset OccurredAt);
