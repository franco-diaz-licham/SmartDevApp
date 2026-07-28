namespace SmartDev.Shared.Messaging;

public sealed record ContactMessageCreatedModel(
    Guid ContactMessageId,
    string SenderName,
    string SenderEmail,
    string Message,
    DateTimeOffset OccurredAt);
