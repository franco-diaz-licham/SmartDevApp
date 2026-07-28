namespace SmartDev.Shared.Messaging;

public static class ContactMessagingTopology
{
    public const string ContactMessageCreatedQueue = "contact-message-created";

    public static readonly Uri ContactMessageCreatedQueueUri = new($"queue:{ContactMessageCreatedQueue}");
}
