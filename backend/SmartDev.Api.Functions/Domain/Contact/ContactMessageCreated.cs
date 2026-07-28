using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Contact;

public sealed record ContactMessageCreated(
    ContactMessageId ContactMessageId,
    string SenderName,
    string SenderEmail,
    string Message,
    DateTimeOffset OccurredAt) : IDomainEvent;
