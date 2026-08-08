using SmartDev.Api.Functions.Domain.Contact;
using static SmartDev.Tests.TestData.AggregateTestData;

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
        contactMessage.Id.Value.ShouldNotBe(Guid.Empty);
        contactMessage.SenderName.ShouldBe("Ada Lovelace");
        contactMessage.SenderEmail.ShouldBe("ada@example.com");
        contactMessage.Message.ShouldBe("I would like to talk about a project.");
        contactMessage.SubmittedAt.ShouldBe(submittedAt);
        contactMessage.Status.ShouldBe(ContactMessageStatus.Submitted);
        contactMessage.EmailSentAt.ShouldBeNull();
        contactMessage.FailureReason.ShouldBeNull();

        var createdEvent = contactMessage.DomainEvents.Single();
        createdEvent.ShouldBeOfType<ContactMessageCreatedEvent>();

        var contactMessageCreated = (ContactMessageCreatedEvent)createdEvent;
        contactMessageCreated.ContactMessageId.ShouldBe(contactMessage.Id);
        contactMessageCreated.SenderName.ShouldBe(contactMessage.SenderName);
        contactMessageCreated.SenderEmail.ShouldBe(contactMessage.SenderEmail);
        contactMessageCreated.Message.ShouldBe(contactMessage.Message);
        contactMessageCreated.OccurredAt.ShouldBe(submittedAt);
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_SenderNameMissing_ThrowsArgumentException(string senderName)
    {
        // Arrange
        var submittedAt = DateTimeOffset.UtcNow;

        // Act
        var exception = Should.Throw<ArgumentException>(() => ContactMessage.Create(
            senderName: senderName,
            senderEmail: "ada@example.com",
            message: "Hello",
            submittedAt: submittedAt));

        // Assert
        exception.ParamName.ShouldBe("senderName");
    }

    [TestCase("")]
    [TestCase("   ")]
    [TestCase("not-an-email-address")]
    public void Create_SenderEmailInvalid_ThrowsArgumentException(string senderEmail)
    {
        // Arrange
        var submittedAt = DateTimeOffset.UtcNow;

        // Act
        var exception = Should.Throw<ArgumentException>(() => ContactMessage.Create(
            senderName: "Ada Lovelace",
            senderEmail: senderEmail,
            message: "Hello",
            submittedAt: submittedAt));

        // Assert
        exception.ParamName.ShouldBe("senderEmail");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_MessageMissing_ThrowsArgumentException(string message)
    {
        // Arrange
        var submittedAt = DateTimeOffset.UtcNow;

        // Act
        var exception = Should.Throw<ArgumentException>(() => ContactMessage.Create(
            senderName: "Ada Lovelace",
            senderEmail: "ada@example.com",
            message: message,
            submittedAt: submittedAt));

        // Assert
        exception.ParamName.ShouldBe("message");
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
        contactMessage.Status.ShouldBe(ContactMessageStatus.EmailSent);
        contactMessage.EmailSentAt.ShouldBe(sentAt);
        contactMessage.FailureReason.ShouldBeNull();
    }

    [Test]
    public void MarkEmailFailed_ValidFailureReason_RecordsFailedStatusAndReason()
    {
        // Arrange
        var contactMessage = CreateContactMessage();

        // Act
        contactMessage.MarkEmailFailed("Mailbox unavailable");

        // Assert
        contactMessage.Status.ShouldBe(ContactMessageStatus.EmailFailed);
        contactMessage.FailureReason.ShouldBe("Mailbox unavailable");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void MarkEmailFailed_FailureReasonMissing_ThrowsArgumentException(string failureReason)
    {
        // Arrange
        var contactMessage = CreateContactMessage();

        // Act
        var exception = Should.Throw<ArgumentException>(() => contactMessage.MarkEmailFailed(failureReason));

        // Assert
        exception.ParamName.ShouldBe("failureReason");
    }
}
