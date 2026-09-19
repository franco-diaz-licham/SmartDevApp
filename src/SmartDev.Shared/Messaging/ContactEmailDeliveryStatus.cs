namespace SmartDev.Shared.Messaging;

/// <summary>
/// Describes the outcome of an email delivery attempt for a contact message.
/// </summary>
public enum ContactEmailDeliveryStatus
{
    /// <summary>
    /// The contact email was accepted by the email provider.
    /// </summary>
    Sent = 1,

    /// <summary>
    /// The contact email could not be delivered.
    /// </summary>
    Failed = 2
}
