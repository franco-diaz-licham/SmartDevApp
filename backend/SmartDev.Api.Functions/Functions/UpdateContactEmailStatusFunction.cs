using Azure.Messaging.ServiceBus;
using MassTransit;
using Microsoft.Azure.Functions.Worker;
using SmartDev.Api.Functions.Infrastructure.Messaging;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;

namespace SmartDev.Api.Functions.Functions;

public sealed class UpdateContactEmailStatusFunction(IMessageReceiver receiver)
{
    [Function(nameof(UpdateContactEmailStatusFunction))]
    public async Task Run(
        [ServiceBusTrigger(ContactMessagingTopology.ContactEmailDeliveryResultQueue, Connection = AzureServiceBusOptions.ConnectionStringAppSettingName)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        await receiver.HandleConsumer<UpdateContactEmailStatusConsumer>(
            ContactMessagingTopology.ContactEmailDeliveryResultQueue,
            message,
            cancellationToken);
    }
}
