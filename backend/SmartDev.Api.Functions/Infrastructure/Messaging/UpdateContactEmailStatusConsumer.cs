using MassTransit;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Shared.Messaging;

namespace SmartDev.Api.Functions.Infrastructure.Messaging;

public sealed class UpdateContactEmailStatusConsumer(UpdateContactEmailStatusHandler handler) : IConsumer<ContactEmailDeliveryResultModel>
{
    public async Task Consume(ConsumeContext<ContactEmailDeliveryResultModel> context)
    {
        await handler.HandleAsync(context.Message, context.CancellationToken);
    }
}
