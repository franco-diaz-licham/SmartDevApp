namespace SmartDev.Shared.Messaging;

/// <summary>
/// Describes the result of attempting to deliver a submitted contact message by email.
/// </summary>
/// <param name="ContactMessageId">The contact message whose email delivery completed.</param>
/// <param name="Status">The final email delivery status.</param>
/// <param name="OccurredAt">The time the delivery result was produced.</param>
/// <param name="FailureReason">The delivery failure reason, when delivery failed.</param>
public sealed record ContactEmailDeliveryResultModel(
    Guid ContactMessageId,
    ContactEmailDeliveryStatus Status,
    DateTimeOffset OccurredAt,
    string? FailureReason);
