namespace SmartDev.Shared.Messaging;

public static class ContactMessagingTopology
{
    public const string ContactMessageCreatedQueue = "contact-message-created";
    public const string ContactEmailDeliveryResultQueue = "contact-email-delivery-result";

    public static readonly Uri ContactMessageCreatedQueueUri = new($"queue:{ContactMessageCreatedQueue}");
    public static readonly Uri ContactEmailDeliveryResultQueueUri = new($"queue:{ContactEmailDeliveryResultQueue}");
}
