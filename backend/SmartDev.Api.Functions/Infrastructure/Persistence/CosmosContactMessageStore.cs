using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Contact;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class CosmosContactMessageStore(IDocumentStore documentStore) : IContactMessageStore
{
    public async Task SaveAsync(ContactMessage contactMessage, CancellationToken cancellationToken)
    {
        await documentStore.EnsureContainerAsync(
            ContactMessageDocument.ContainerName,
            ContactMessageDocument.PartitionKeyPath,
            cancellationToken: cancellationToken);

        var created = await documentStore.TryCreateAsync(
            ContactMessageDocument.ContainerName,
            ContactMessageDocument.FromDomain(contactMessage),
            ContactMessageDocument.PartitionKey,
            cancellationToken);

        if (!created) throw new InvalidOperationException($"Contact message {contactMessage.Id} already exists.");
    }
}
