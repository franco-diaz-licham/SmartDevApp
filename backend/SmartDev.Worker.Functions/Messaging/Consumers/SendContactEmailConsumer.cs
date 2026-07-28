using System.Net;
using MassTransit;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartDev.Application.Ports;
using SmartDev.Infrastructure.Messaging;
using SmartDev.Worker.Functions.Configuration.Options;

namespace SmartDev.Worker.Functions.Messaging.Consumers;

public sealed class SendContactEmailConsumer(
    IEmailSender emailSender,
    IOptions<ContactEmailOptions> options,
    ILogger<SendContactEmailConsumer> logger) : IConsumer<ContactMessageCreatedModel>
{
    private readonly ContactEmailOptions options = options.Value;

    public async Task Consume(ConsumeContext<ContactMessageCreatedModel> context)
    {
        var message = context.Message;
        var subject = $"{options.SubjectPrefix}: {message.SenderName}";

        await emailSender.SendAsync(
            new EmailMessageModel(
                To: options.RecipientAddress,
                Subject: subject,
                Body: BuildPlainTextBody(message),
                HtmlBody: BuildHtmlBody(message)),
            context.CancellationToken);

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
