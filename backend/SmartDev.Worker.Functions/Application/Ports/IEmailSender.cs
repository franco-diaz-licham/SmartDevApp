namespace SmartDev.Worker.Functions.Application.Ports;

public sealed record EmailMessageModel(
    string To,
    string Subject,
    string Body,
    string? HtmlBody = null);

/// <summary>
/// Sends email messages through the configured delivery provider.
/// </summary>
public interface IEmailSender
{
    /// <summary>
    /// Sends an email message.
    /// </summary>
    /// <param name="message">The email message to send.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task SendAsync(EmailMessageModel message, CancellationToken cancellationToken = default);
}
