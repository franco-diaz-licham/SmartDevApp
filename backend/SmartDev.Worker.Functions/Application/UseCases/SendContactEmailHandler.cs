using System.Net;
using Microsoft.Extensions.Logging;
using SmartDev.Shared.Messaging;
using SmartDev.Worker.Functions.Application.Ports;

namespace SmartDev.Worker.Functions.Application.UsesCases;

public sealed class SendContactEmailHandler(
    IEmailSender emailSender,
    IIntegrationEventPublisher integrationEventPublisher,
    ILogger<SendContactEmailHandler> logger)
{
    private const string SubjectPrefix = "New portfolio contact message";

    public async Task HandleAsync(ContactMessageCreatedModel message, CancellationToken cancellationToken)
    {
        try {
            await emailSender.SendAsync(
                new EmailMessageModel(
                    To: message.SenderEmail,
                    Subject: BuildSubject(message),
                    Body: BuildPlainTextBody(message),
                    HtmlBody: BuildHtmlBody(message)),
                cancellationToken);
        } catch (Exception exception) {
            await integrationEventPublisher.PublishAsync(
                new ContactEmailDeliveryResultModel(
                    ContactMessageId: message.ContactMessageId,
                    Status: ContactEmailDeliveryStatus.Failed,
                    OccurredAt: DateTimeOffset.UtcNow,
                    FailureReason: exception.Message),
                cancellationToken);

            logger.LogError(
                exception,
                "Contact message email failed for {ContactMessageId} from {SenderEmail}",
                message.ContactMessageId,
                message.SenderEmail);

            return;
        }

        await integrationEventPublisher.PublishAsync(
            new ContactEmailDeliveryResultModel(
                ContactMessageId: message.ContactMessageId,
                Status: ContactEmailDeliveryStatus.Sent,
                OccurredAt: DateTimeOffset.UtcNow,
                FailureReason: null),
            cancellationToken);

        logger.LogInformation(
            "Contact message email sent for {ContactMessageId} from {SenderEmail}",
            message.ContactMessageId,
            message.SenderEmail);
    }

    private static string BuildSubject(ContactMessageCreatedModel message)
    {
        return $"{SubjectPrefix}: {message.SenderName}";
    }

    private static string BuildPlainTextBody(ContactMessageCreatedModel message)
    {
        return $"""
            New contact message received.

            From: {message.SenderName}
            Email: {message.SenderEmail}
            Contact Message Id: {message.ContactMessageId}
            Occurred At: {message.OccurredAt:O}

            {message.Message}
            """;
    }

    private static string BuildHtmlBody(ContactMessageCreatedModel message)
    {
        return $"""
            <h2>New contact message received</h2>
            <p><strong>From:</strong> {WebUtility.HtmlEncode(message.SenderName)}</p>
            <p><strong>Email:</strong> {WebUtility.HtmlEncode(message.SenderEmail)}</p>
            <p><strong>Contact Message Id:</strong> {message.ContactMessageId}</p>
            <p><strong>Occurred At:</strong> {message.OccurredAt:O}</p>
            <p>{WebUtility.HtmlEncode(message.Message).Replace("\n", "<br />")}</p>
            """;
    }
}
