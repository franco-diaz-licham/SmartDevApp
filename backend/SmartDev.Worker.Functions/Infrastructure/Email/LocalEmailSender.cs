using Microsoft.Extensions.Logging;
using SmartDev.Worker.Functions.Application.Ports;

namespace SmartDev.Worker.Functions.Infrastructure.Email;

public sealed class LocalEmailSender(ILogger<LocalEmailSender> logger) : IEmailSender
{
    public Task SendAsync(EmailMessageModel message, CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Local email sender accepted email to {EmailTo}. Subject: {EmailSubject}",
            message.To,
            message.Subject);

        return Task.CompletedTask;
    }
}
