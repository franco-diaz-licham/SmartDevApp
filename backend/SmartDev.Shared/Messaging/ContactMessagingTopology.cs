namespace SmartDev.Shared.Messaging;

/// <summary>
/// Defines Service Bus entity names used by contact-message workflows.
/// </summary>
public static class ContactMessagingTopology
{
    /// <summary>
    /// Queue that carries submitted contact messages to the email worker.
    /// </summary>
    public const string ContactMessageCreatedQueue = "contact-message-created";

    /// <summary>
    /// Queue that carries contact email delivery results back to the API.
    /// </summary>
    public const string ContactEmailDeliveryResultQueue = "contact-email-delivery-result";
}
