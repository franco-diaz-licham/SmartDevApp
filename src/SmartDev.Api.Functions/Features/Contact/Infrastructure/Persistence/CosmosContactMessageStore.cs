using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Contact.Contracts;
using SmartDev.Api.Functions.Features.Contact.Domain;

namespace SmartDev.Api.Functions.Features.Contact.Infrastructure.Persistence;

public sealed class CosmosContactMessageStore(IDocumentStore documentStore) : IContactMessageStore
{
    public async Task SaveAsync(ContactMessage contactMessage, CancellationToken cancellationToken)
    {
        var created = await documentStore.TryCreateAsync(
            ContactMessageDocument.ContainerName,
            ContactMessageDocument.FromDomain(contactMessage),
            ContactMessageDocument.PartitionKey,
            cancellationToken);

        if (!created) throw new InvalidOperationException($"Contact message {contactMessage.Id} already exists.");
    }

    public async Task MarkEmailSentAsync(ContactMessageId contactMessageId, DateTimeOffset sentAt, CancellationToken cancellationToken)
    {
        var document = await GetContactMessageDocumentAsync(contactMessageId, cancellationToken);
        document.Status = ContactMessageStatus.EmailSent;
        document.EmailSentAt = sentAt;
        document.FailureReason = null;
        await documentStore.UpsertAsync(ContactMessageDocument.ContainerName, document, ContactMessageDocument.PartitionKey, cancellationToken);
    }

    public async Task MarkEmailFailedAsync(ContactMessageId contactMessageId, string failureReason, CancellationToken cancellationToken)
    {
        var document = await GetContactMessageDocumentAsync(contactMessageId, cancellationToken);
        document.Status = ContactMessageStatus.EmailFailed;
        document.FailureReason = string.IsNullOrWhiteSpace(failureReason)
            ? "Email delivery failed."
            : failureReason.Trim()[..Math.Min(failureReason.Trim().Length, 1000)];

        await documentStore.UpsertAsync(ContactMessageDocument.ContainerName, document, ContactMessageDocument.PartitionKey, cancellationToken);
    }

    private async Task<ContactMessageDocument> GetContactMessageDocumentAsync(ContactMessageId contactMessageId, CancellationToken cancellationToken)
    {
        var document = await documentStore.GetAsync<ContactMessageDocument>(
            ContactMessageDocument.ContainerName,
            contactMessageId.Value.ToString("D"),
            ContactMessageDocument.PartitionKey,
            cancellationToken);

        return document ?? throw new InvalidOperationException($"Contact message {contactMessageId.Value:D} was not found.");
    }
}




