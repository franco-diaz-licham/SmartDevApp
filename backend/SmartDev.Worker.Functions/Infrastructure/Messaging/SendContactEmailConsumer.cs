using MassTransit;
using SmartDev.Shared.Messaging;
using SmartDev.Worker.Functions.Application.UsesCases;

namespace SmartDev.Worker.Functions.Infrastructure.Messaging;

public sealed class SendContactEmailConsumer(SendContactEmailHandler handler) : IConsumer<ContactMessageCreatedModel>
{
    public async Task Consume(ConsumeContext<ContactMessageCreatedModel> context)
    {
        await handler.HandleAsync(context.Message, context.CancellationToken);
    }
}
