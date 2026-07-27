using SmartDev.Domain.Common;

namespace SmartDev.Domain.Contact;

public sealed record ContactMessageCreated(
    ContactMessageId ContactMessageId,
    string SenderName,
    string SenderEmail,
    string Message,
    DateTimeOffset OccurredAt) : IDomainEvent;
