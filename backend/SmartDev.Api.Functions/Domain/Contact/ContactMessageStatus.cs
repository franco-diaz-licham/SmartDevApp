namespace SmartDev.Api.Functions.Domain.Contact;

/// <summary>
/// Describes the email delivery lifecycle for a submitted contact message.
/// </summary>
public enum ContactMessageStatus
{
    /// <summary>
    /// The message has been accepted and is awaiting email delivery.
    /// </summary>
    Submitted = 0,

    /// <summary>
    /// The contact email was delivered successfully.
    /// </summary>
    EmailSent = 1,

    /// <summary>
    /// The contact email delivery attempt failed.
    /// </summary>
    EmailFailed = 2
}
