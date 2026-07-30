using System.Net;
using System.Reflection;
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
    private const string ContactEmailTemplateResourceName = "SmartDev.Worker.Functions.Application.Templates.ContactEmail.html";

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
            New contact message received

            From: {message.SenderName}
            Email: {message.SenderEmail}
            Contact Message Id: {message.ContactMessageId}
            Occurred At: {FormatOccurredAt(message)}

            Message:
            {message.Message}
            """;
    }

    private static string BuildHtmlBody(ContactMessageCreatedModel message)
    {
        var template = LoadContactEmailTemplate();

        return template
            .Replace("{{SenderName}}", HtmlEncode(message.SenderName), StringComparison.Ordinal)
            .Replace("{{SenderEmail}}", HtmlEncode(message.SenderEmail), StringComparison.Ordinal)
            .Replace("{{ContactMessageId}}", message.ContactMessageId.ToString(), StringComparison.Ordinal)
            .Replace("{{OccurredAt}}", HtmlEncode(FormatOccurredAt(message)), StringComparison.Ordinal)
            .Replace("{{Message}}", HtmlEncodeMultiline(message.Message), StringComparison.Ordinal);
    }

    private static string LoadContactEmailTemplate()
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(ContactEmailTemplateResourceName)
            ?? throw new InvalidOperationException($"Unable to load embedded resource {ContactEmailTemplateResourceName}.");

        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    private static string FormatOccurredAt(ContactMessageCreatedModel message)
    {
        return $"{message.OccurredAt:dd MMM yyyy HH:mm:ss zzz} ({message.OccurredAt:O})";
    }

    private static string HtmlEncode(string value)
    {
        return WebUtility.HtmlEncode(value);
    }

    private static string HtmlEncodeMultiline(string value)
    {
        return HtmlEncode(value)
            .Replace("\r\n", "\n", StringComparison.Ordinal)
            .Replace("\r", "\n", StringComparison.Ordinal)
            .Replace("\n", "<br>", StringComparison.Ordinal);
    }
}
