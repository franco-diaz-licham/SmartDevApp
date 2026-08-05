using SmartDev.Api.Functions.Domain.Notes;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Notes;

[TestFixture]
public sealed class NoteTests
{
    [Test]
    public void CreateDraft_ValidDetails_CreatesPrivateDraft()
    {
        // Arrange
        var now = new DateTimeOffset(2026, 8, 5, 12, 0, 0, TimeSpan.Zero);

        // Act
        var note = CreateNote(createdAt: now);

        // Assert
        note.Status.ShouldBe(NoteStatus.Draft);
        note.Visibility.ShouldBe(NoteVisibility.Private);
        note.CreatedAt.ShouldBeGreaterThan(DateTimeOffset.UtcNow.AddMinutes(-1));
        note.UpdatedAt.ShouldBeNull();
        note.PublishedAt.ShouldBeNull();
        note.ArchivedAt.ShouldBeNull();
        note.DomainEvents.OfType<NoteCreated>().Count().ShouldBe(1);
    }

    [Test]
    public void Publish_DraftNote_MakesPublishedAndPublic()
    {
        // Arrange
        var note = CreateNote();
        var publishedAt = new DateTimeOffset(2026, 8, 5, 13, 0, 0, TimeSpan.Zero);

        // Act
        note.Publish(publishedAt);

        // Assert
        note.Status.ShouldBe(NoteStatus.Published);
        note.Visibility.ShouldBe(NoteVisibility.Public);
        note.PublishedAt.ShouldBe(publishedAt);
        note.UpdatedAt.ShouldBe(publishedAt);
        note.DomainEvents.OfType<NotePublished>().Count().ShouldBe(1);
    }

    [Test]
    public void CreateDraft_DuplicateTags_StoresUniqueTags()
    {
        // Act
        var note = CreateNote(tags: ["dotnet", "azure-functions", "dotnet"]);

        // Assert
        note.Tags.Select(tag => tag.Slug.Value).ShouldBe(["dotnet", "azure-functions"]);
    }

    [TestCase("")]
    [TestCase("   ")]
    public void CreateDraft_TitleMissing_ThrowsArgumentException(string title)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateNote(title: title));

        // Assert
        exception.ParamName.ShouldBe("title");
    }

    [TestCase("Azure Functions")]
    [TestCase("azure_functions")]
    [TestCase("azure--functions")]
    public void CreateDraft_InvalidSlug_ThrowsArgumentException(string slug)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateNote(slug: slug));

        // Assert
        exception.ParamName.ShouldBe("slug");
    }

    [Test]
    public void CreateDraft_BodyTooLarge_ThrowsArgumentException()
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateNote(bodyMarkdown: new string('a', MarkdownContent.MaxLength + 1)));

        // Assert
        exception.ParamName.ShouldBe("bodyMarkdown");
    }

    [Test]
    public void CreateDraft_TagsEmpty_ThrowsArgumentException()
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateNote(tags: []));

        // Assert
        exception.ParamName.ShouldBe("tags");
    }
}
