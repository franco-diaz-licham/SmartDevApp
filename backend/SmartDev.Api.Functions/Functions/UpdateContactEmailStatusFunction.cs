using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Shared.Messaging;
using SmartDev.Shared.Options;

namespace SmartDev.Api.Functions.Functions;

public sealed class UpdateContactEmailStatusFunction(UpdateContactEmailStatusHandler handler)
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    [Function(nameof(UpdateContactEmailStatusFunction))]
    public async Task Run(
        [ServiceBusTrigger(ContactMessagingTopology.ContactEmailDeliveryResultQueue, Connection = AzureServiceBusOptions.SectionName)]
        ServiceBusReceivedMessage message,
        CancellationToken cancellationToken)
    {
        var result = JsonSerializer.Deserialize<ContactEmailDeliveryResultModel>(message.Body.ToString(), SerializerOptions)
            ?? throw new InvalidOperationException($"Unable to deserialize {nameof(ContactEmailDeliveryResultModel)}.");

        await handler.HandleAsync(result, cancellationToken);
    }
}
