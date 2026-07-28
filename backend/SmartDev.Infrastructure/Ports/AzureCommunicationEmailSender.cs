using Azure;
using Azure.Communication.Email;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartDev.Application.Ports;
using SmartDev.Infrastructure.Options;

namespace SmartDev.Infrastructure.Ports;

public sealed class AzureCommunicationEmailSender(IOptions<AzureCommunicationServiceOptions> options, ILogger<AzureCommunicationEmailSender> logger) : IEmailSender
{
    private readonly AzureCommunicationServiceOptions options = options.Value;

    public async Task SendAsync(EmailMessageModel message, CancellationToken cancellationToken = default)
    {
        var emailClient = new EmailClient(options.ConnectionString);
        var emailMessage = new Azure.Communication.Email.EmailMessage(
            senderAddress: options.SenderAddress,
            recipientAddress: message.To,
            content: new EmailContent(message.Subject) {
                PlainText = message.Body,
                Html = message.HtmlBody
            });

        var operation = await emailClient.SendAsync(WaitUntil.Completed, emailMessage, cancellationToken: cancellationToken);
        logger.LogInformation(
            "Azure Communication Services email sent to {EmailTo}. OperationId: {OperationId}. Status: {EmailStatus}",
            message.To,
            operation.Id,
            operation.Value.Status);
    }
}
