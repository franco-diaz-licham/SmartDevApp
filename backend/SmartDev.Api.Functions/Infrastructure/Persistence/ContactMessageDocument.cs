using Newtonsoft.Json;
using SmartDev.Api.Functions.Domain.Contact;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class ContactMessageDocument
{
    public const string ContainerName = "contact-messages";
    public const string PartitionKey = "contact-message";
    public const string PartitionKeyPath = "/partitionKey";

    [JsonProperty("id")]
    public string Id { get; init; } = string.Empty;

    [JsonProperty("partitionKey")]
    public string PartitionKeyValue { get; init; } = PartitionKey;

    public string SenderName { get; init; } = string.Empty;

    public string SenderEmail { get; init; } = string.Empty;

    public string Message { get; init; } = string.Empty;

    public DateTimeOffset SubmittedAt { get; init; }

    public string Status { get; init; } = string.Empty;

    public static ContactMessageDocument FromDomain(ContactMessage contactMessage)
    {
        return new ContactMessageDocument {
            Id = contactMessage.Id.Value.ToString("D"),
            SenderName = contactMessage.SenderName,
            SenderEmail = contactMessage.SenderEmail,
            Message = contactMessage.Message,
            SubmittedAt = contactMessage.SubmittedAt,
            Status = contactMessage.Status.ToString()
        };
    }
}
