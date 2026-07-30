using Microsoft.Extensions.Logging;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Contact;
using SmartDev.Shared.Messaging;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed class UpdateContactEmailStatusHandler(IContactMessageStore contactMessageStore, ILogger<UpdateContactEmailStatusHandler> logger)
{
    public async Task HandleAsync(ContactEmailDeliveryResultModel result, CancellationToken cancellationToken)
    {
        var contactMessageId = new ContactMessageId(result.ContactMessageId);

        switch (result.Status) {
            case ContactEmailDeliveryStatus.Sent:
                await contactMessageStore.MarkEmailSentAsync(contactMessageId, result.OccurredAt, cancellationToken);
                return;
            case ContactEmailDeliveryStatus.Failed:
                await contactMessageStore.MarkEmailFailedAsync(contactMessageId, result.FailureReason ?? "Email delivery failed.", cancellationToken);
                logger.LogWarning("Contact message {ContactMessageId} marked as email failed. Reason: {FailureReason}", result.ContactMessageId, result.FailureReason);
                return;
            default:
                throw new InvalidOperationException($"Unsupported contact email delivery status {result.Status}.");
        }
    }
}
