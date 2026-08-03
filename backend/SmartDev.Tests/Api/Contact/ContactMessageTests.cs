using SmartDev.Api.Functions.Domain.Contact;

namespace SmartDev.Tests.Api.Contact;

[TestFixture]
public sealed class ContactMessageTests
{
    [Test]
    public void Create_ValidDetails_CreatesSubmittedMessageAndRaisesCreatedEvent()
    {
        // Arrange
        var submittedAt = new DateTimeOffset(2026, 8, 3, 10, 30, 0, TimeSpan.Zero);

        // Act
        var contactMessage = ContactMessage.Create(
            senderName: "  Ada Lovelace  ",
            senderEmail: "  ada@example.com  ",
            message: "  I would like to talk about a project.  ",
            submittedAt: submittedAt);

        // Assert
        Assert.That(contactMessage.Id.Value, Is.Not.EqualTo(Guid.Empty));
        Assert.That(contactMessage.SenderName, Is.EqualTo("Ada Lovelace"));
        Assert.That(contactMessage.SenderEmail, Is.EqualTo("ada@example.com"));
        Assert.That(contactMessage.Message, Is.EqualTo("I would like to talk about a project."));
        Assert.That(contactMessage.SubmittedAt, Is.EqualTo(submittedAt));
        Assert.That(contactMessage.Status, Is.EqualTo(ContactMessageStatus.Submitted));
        Assert.That(contactMessage.EmailSentAt, Is.Null);
        Assert.That(contactMessage.FailureReason, Is.Null);

        var createdEvent = contactMessage.DomainEvents.Single();
        Assert.That(createdEvent, Is.TypeOf<ContactMessageCreated>());

        var contactMessageCreated = (ContactMessageCreated)createdEvent;
        Assert.That(contactMessageCreated.ContactMessageId, Is.EqualTo(contactMessage.Id));
        Assert.That(contactMessageCreated.SenderName, Is.EqualTo(contactMessage.SenderName));
        Assert.That(contactMessageCreated.SenderEmail, Is.EqualTo(contactMessage.SenderEmail));
        Assert.That(contactMessageCreated.Message, Is.EqualTo(contactMessage.Message));
        Assert.That(contactMessageCreated.OccurredAt, Is.EqualTo(submittedAt));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_SenderNameMissing_ThrowsArgumentException(string senderName)
    {
        // Arrange
        var submittedAt = DateTimeOffset.UtcNow;

        // Act
        var exception = Assert.Throws<ArgumentException>(() => ContactMessage.Create(
            senderName: senderName,
            senderEmail: "ada@example.com",
            message: "Hello",
            submittedAt: submittedAt));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("senderName"));
    }

    [TestCase("")]
    [TestCase("   ")]
    [TestCase("not-an-email-address")]
    public void Create_SenderEmailInvalid_ThrowsArgumentException(string senderEmail)
    {
        // Arrange
        var submittedAt = DateTimeOffset.UtcNow;

        // Act
        var exception = Assert.Throws<ArgumentException>(() => ContactMessage.Create(
            senderName: "Ada Lovelace",
            senderEmail: senderEmail,
            message: "Hello",
            submittedAt: submittedAt));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("senderEmail"));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_MessageMissing_ThrowsArgumentException(string message)
    {
        // Arrange
        var submittedAt = DateTimeOffset.UtcNow;

        // Act
        var exception = Assert.Throws<ArgumentException>(() => ContactMessage.Create(
            senderName: "Ada Lovelace",
            senderEmail: "ada@example.com",
            message: message,
            submittedAt: submittedAt));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("message"));
    }

    [Test]
    public void MarkEmailSent_EmailHadFailed_RecordsSentStatusAndClearsFailureReason()
    {
        // Arrange
        var contactMessage = CreateContactMessage();
        contactMessage.MarkEmailFailed("SMTP timeout");
        var sentAt = new DateTimeOffset(2026, 8, 3, 11, 0, 0, TimeSpan.Zero);

        // Act
        contactMessage.MarkEmailSent(sentAt);

        // Assert
        Assert.That(contactMessage.Status, Is.EqualTo(ContactMessageStatus.EmailSent));
        Assert.That(contactMessage.EmailSentAt, Is.EqualTo(sentAt));
        Assert.That(contactMessage.FailureReason, Is.Null);
    }

    [Test]
    public void MarkEmailFailed_ValidFailureReason_RecordsFailedStatusAndReason()
    {
        // Arrange
        var contactMessage = CreateContactMessage();

        // Act
        contactMessage.MarkEmailFailed("Mailbox unavailable");

        // Assert
        Assert.That(contactMessage.Status, Is.EqualTo(ContactMessageStatus.EmailFailed));
        Assert.That(contactMessage.FailureReason, Is.EqualTo("Mailbox unavailable"));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void MarkEmailFailed_FailureReasonMissing_ThrowsArgumentException(string failureReason)
    {
        // Arrange
        var contactMessage = CreateContactMessage();

        // Act
        var exception = Assert.Throws<ArgumentException>(() => contactMessage.MarkEmailFailed(failureReason));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("failureReason"));
    }

    private static ContactMessage CreateContactMessage()
    {
        return ContactMessage.Create(
            senderName: "Ada Lovelace",
            senderEmail: "ada@example.com",
            message: "Hello",
            submittedAt: DateTimeOffset.UtcNow);
    }
}
