using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Contact;

public sealed class ContactMessage : Entity<ContactMessageId>
{
    private ContactMessage(
        ContactMessageId id,
        string senderName,
        string senderEmail,
        string message,
        DateTimeOffset submittedAt)
        : base(id)
    {
        SenderName = senderName;
        SenderEmail = senderEmail;
        Message = message;
        SubmittedAt = submittedAt;
        Status = ContactMessageStatus.Submitted;
    }

    /// <summary>
    /// Gets the name supplied by the person submitting the contact form.
    /// </summary>
    public string SenderName { get; private set; }

    /// <summary>
    /// Gets the email address supplied by the person submitting the contact form.
    /// </summary>
    public string SenderEmail { get; private set; }

    /// <summary>
    /// Gets the submitted contact message body.
    /// </summary>
    public string Message { get; private set; }

    /// <summary>
    /// Gets when the contact message was submitted.
    /// </summary>
    public DateTimeOffset SubmittedAt { get; }

    /// <summary>
    /// Gets the current contact message processing status.
    /// </summary>
    public ContactMessageStatus Status { get; private set; }

    /// <summary>
    /// Gets when the contact email was sent, when delivery has succeeded.
    /// </summary>
    public DateTimeOffset? EmailSentAt { get; private set; }

    /// <summary>
    /// Gets the email delivery failure reason, when delivery has failed.
    /// </summary>
    public string? FailureReason { get; private set; }

    public static ContactMessage Create(
        string senderName,
        string senderEmail,
        string message,
        DateTimeOffset submittedAt)
    {
        var email = Guard.Required(senderEmail, nameof(senderEmail), 320);
        if (!email.Contains('@', StringComparison.Ordinal)) throw new ArgumentException("senderEmail must be a valid email address.", nameof(senderEmail));

        var contactMessage = new ContactMessage(
            ContactMessageId.New(),
            Guard.Required(senderName, nameof(senderName), 120),
            email,
            Guard.Required(message, nameof(message), 4000),
            submittedAt);

        contactMessage.RaiseDomainEvent(new ContactMessageCreated(
            contactMessage.Id,
            contactMessage.SenderName,
            contactMessage.SenderEmail,
            contactMessage.Message,
            submittedAt));

        return contactMessage;
    }

    public void MarkEmailSent(DateTimeOffset sentAt)
    {
        Status = ContactMessageStatus.EmailSent;
        EmailSentAt = sentAt;
        FailureReason = null;
    }

    public void MarkEmailFailed(string failureReason)
    {
        Status = ContactMessageStatus.EmailFailed;
        FailureReason = Guard.Required(failureReason, nameof(failureReason), 1000);
    }
}
