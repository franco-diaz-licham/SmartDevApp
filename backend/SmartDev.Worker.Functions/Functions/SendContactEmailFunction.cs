using Azure.Messaging.ServiceBus;
using MassTransit;
using Microsoft.Azure.Functions.Worker;
using SmartDev.Infrastructure.Messaging;
using SmartDev.Infrastructure.Options;

namespace SmartDev.Worker.Functions.Functions;

public sealed class SendContactEmailFunction(IMessageReceiver receiver)
{
    [Function(nameof(SendContactEmailFunction))]
    public async Task Run(
        [ServiceBusTrigger(
            ContactMessagingTopology.ContactMessageCreatedTopic,
            ContactMessagingTopology.EmailWorkerSubscription,
            Connection = AzureServiceBusOptions.ConnectionStringConfigurationKey)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        await receiver.Handle(
            ContactMessagingTopology.ContactMessageCreatedTopic,
            ContactMessagingTopology.EmailWorkerSubscription,
            message,
            cancellationToken);
    }
}
