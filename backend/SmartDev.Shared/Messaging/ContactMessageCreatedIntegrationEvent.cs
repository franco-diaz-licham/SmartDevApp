namespace SmartDev.Shared.Messaging;

public sealed record ContactMessageCreatedIntegrationEvent(
    Guid ContactMessageId,
    string SenderName,
    string SenderEmail,
    string Message,
    DateTimeOffset OccurredAt);
