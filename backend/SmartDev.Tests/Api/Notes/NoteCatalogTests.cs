using SmartDev.Api.Functions.Domain.Notes;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Notes;

[TestFixture]
public sealed class NoteCatalogTests
{
    [Test]
    public void CreateNoteCategory_ValidDetails_CreatesCategorySnapshot()
    {
        // Act
        var category = CreateNoteCategory("backend", "Backend");

        // Assert
        category.Id.Value.ShouldBe("backend");
        category.DisplayName.ShouldBe("Backend");
        category.IsActive.ShouldBeTrue();
        category.Snapshot.Slug.Value.ShouldBe("backend");
        category.Snapshot.DisplayName.ShouldBe("Backend");
    }

    [Test]
    public void CreateNoteTag_ValidDetails_CreatesTagSnapshotAndNormalizesAliases()
    {
        // Act
        var tag = CreateNoteTag("csharp", "C#", [" C# ", "c-sharp", "c#"]);

        // Assert
        tag.Id.Value.ShouldBe("csharp");
        tag.DisplayName.ShouldBe("C#");
        tag.Aliases.ShouldBe(["c#", "c-sharp"]);
        tag.Snapshot.Slug.Value.ShouldBe("csharp");
        tag.Snapshot.DisplayName.ShouldBe("C#");
    }

    [TestCase("C Sharp")]
    [TestCase("c_sharp")]
    public void CreateNoteTag_InvalidSlug_ThrowsArgumentException(string slug)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => NoteTag.Create(NoteTagSlug.Create(slug), "C#"));

        // Assert
        exception.ParamName.ShouldBe("tagSlug");
    }
}
