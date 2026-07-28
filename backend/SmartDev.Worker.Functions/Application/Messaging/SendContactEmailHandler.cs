using System.Net;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartDev.Shared.Messaging;
using SmartDev.Worker.Functions.Application.Ports;
using SmartDev.Worker.Functions.Infrastructure.Options;

namespace SmartDev.Worker.Functions.Application.Messaging;

public sealed class SendContactEmailHandler(
    IEmailSender emailSender,
    IOptions<ContactEmailOptions> options,
    ILogger<SendContactEmailHandler> logger)
{
    private readonly ContactEmailOptions options = options.Value;

    public async Task HandleAsync(ContactMessageCreatedModel message, CancellationToken cancellationToken)
    {
        var subject = $"{options.SubjectPrefix}: {message.SenderName}";

        await emailSender.SendAsync(
            new EmailMessageModel(
                To: options.RecipientAddress,
                Subject: subject,
                Body: BuildPlainTextBody(message),
                HtmlBody: BuildHtmlBody(message)),
            cancellationToken);

        logger.LogInformation(
            "Contact message email sent for {ContactMessageId} from {SenderEmail}",
            message.ContactMessageId,
            message.SenderEmail);
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
