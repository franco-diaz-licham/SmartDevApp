namespace SmartDev.Shared.Messaging;

public sealed record ContactEmailDeliveryResultModel(
    Guid ContactMessageId,
    ContactEmailDeliveryStatus Status,
    DateTimeOffset OccurredAt,
    string? FailureReason);
