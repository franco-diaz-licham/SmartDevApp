using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace SmartDev.Worker.Functions.Functions;

public sealed class SendContactEmailFunction
{
    private readonly ILogger<SendContactEmailFunction> _logger;

    public SendContactEmailFunction(ILogger<SendContactEmailFunction> logger)
    {
        _logger = logger;
    }

    [Function(nameof(SendContactEmailFunction))]
    public async Task Run(
        [ServiceBusTrigger("send-contact-email", Connection = "")]
        ServiceBusReceivedMessage message,
        ServiceBusMessageActions messageActions)
    {
        _logger.LogInformation("Message ID: {MessageId}", message.MessageId);
        _logger.LogInformation("Message Body: {MessageBody}", message.Body);
        _logger.LogInformation("Message Content-Type: {ContentType}", message.ContentType);

        await messageActions.CompleteMessageAsync(message);
    }
}
