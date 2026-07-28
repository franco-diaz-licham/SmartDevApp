using Azure.Messaging.ServiceBus;
using MassTransit;
using Microsoft.Azure.Functions.Worker;
using SmartDev.Infrastructure.Messaging;
using SmartDev.Infrastructure.Options;
using SmartDev.Worker.Functions.Messaging.Consumers;

namespace SmartDev.Worker.Functions.Functions;

public sealed class SendContactEmailFunction(IMessageReceiver receiver)
{
    [Function(nameof(SendContactEmailFunction))]
    public async Task Run(
        [ServiceBusTrigger(ContactMessagingTopology.ContactMessageCreatedQueue, Connection = AzureServiceBusOptions.ConnectionStringConfigurationKey)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        await receiver.HandleConsumer<SendContactEmailConsumer>(
            ContactMessagingTopology.ContactMessageCreatedQueue,
            message,
            cancellationToken);
    }
}
