using Azure.Messaging.ServiceBus;
using MassTransit;
using Microsoft.Azure.Functions.Worker;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;
using SmartDev.Worker.Functions.Infrastructure.Messaging;

namespace SmartDev.Worker.Functions.Functions;

public sealed class SendContactEmailFunction(IMessageReceiver receiver)
{
    [Function(nameof(SendContactEmailFunction))]
    public async Task Run(
        [ServiceBusTrigger(ContactMessagingTopology.ContactMessageCreatedQueue, Connection = AzureServiceBusOptions.ConnectionStringAppSettingName)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        await receiver.HandleConsumer<SendContactEmailConsumer>(
            ContactMessagingTopology.ContactMessageCreatedQueue,
            message,
            cancellationToken);
    }
}
