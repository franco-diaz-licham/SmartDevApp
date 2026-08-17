using SmartDev.Api.Functions.Domain.Articles;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Articles;

[TestFixture]
public sealed class ArticleCatalogTests
{
    [Test]
    public void CreateArticleCategory_ValidDetails_CreatesCategorySnapshot()
    {
        // Act
        var category = CreateArticleCategory("backend", "Backend");

        // Assert
        category.Id.Value.ShouldBe("backend");
        category.DisplayName.ShouldBe("Backend");
        category.IsActive.ShouldBeTrue();
        category.Snapshot.Slug.Value.ShouldBe("backend");
        category.Snapshot.DisplayName.ShouldBe("Backend");
    }

    [Test]
    public void CreateArticleTag_ValidDetails_CreatesTagSnapshotAndNormalizesAliases()
    {
        // Act
        var tag = CreateArticleTag("csharp", "C#", [" C# ", "c-sharp", "c#"]);

        // Assert
        tag.Id.Value.ShouldBe("csharp");
        tag.DisplayName.ShouldBe("C#");
        tag.Aliases.ShouldBe(["c#", "c-sharp"]);
        tag.Snapshot.Slug.Value.ShouldBe("csharp");
        tag.Snapshot.DisplayName.ShouldBe("C#");
    }

    [TestCase("C Sharp")]
    [TestCase("c_sharp")]
    public void CreateArticleTag_InvalidSlug_ThrowsArgumentException(string slug)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleTag.Create(ArticleTagSlug.Create(slug), "C#"));

        // Assert
        exception.ParamName.ShouldBe("tagSlug");
    }
}
