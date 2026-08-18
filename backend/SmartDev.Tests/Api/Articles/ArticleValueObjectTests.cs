using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Tests.Api.Articles;

[TestFixture]
public sealed class ArticleValueObjectTests
{
    [Test]
    public void ArticleTitle_Create_TrimsValue()
    {
        // Arrange
        const string value = "  Building Azure Functions  ";

        // Act
        var title = ArticleTitle.Create(value);

        // Assert
        title.Value.ShouldBe("Building Azure Functions");
        title.ToString().ShouldBe("Building Azure Functions");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void ArticleTitle_Create_MissingValue_ThrowsArgumentException(string value)
    {
        // Arrange
        const string expectedParamName = "title";

        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleTitle.Create(value));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }

    [Test]
    public void ArticleTitle_Create_ValueTooLong_ThrowsArgumentException()
    {
        // Arrange
        var value = new string('a', 161);

        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleTitle.Create(value));

        // Assert
        exception.ParamName.ShouldBe("title");
    }

    [Test]
    public void ArticleSlug_Create_NormalizesToLowercase()
    {
        // Arrange
        const string value = "Azure-Functions-101";

        // Act
        var slug = ArticleSlug.Create(value);

        // Assert
        slug.Value.ShouldBe("azure-functions-101");
        slug.ToString().ShouldBe("azure-functions-101");
    }

    [TestCase("azure functions")]
    [TestCase("azure_functions")]
    [TestCase("azure--functions")]
    [TestCase("-azure-functions")]
    [TestCase("azure-functions-")]
    public void ArticleSlug_Create_InvalidValue_ThrowsArgumentException(string value)
    {
        // Arrange
        const string expectedParamName = "slug";

        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleSlug.Create(value));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }

    [Test]
    public void ArticleSummary_Create_TrimsValue()
    {
        // Arrange
        const string value = "  Short preview.  ";

        // Act
        var summary = ArticleSummary.Create(value);

        // Assert
        summary.Value.ShouldBe("Short preview.");
        summary.ToString().ShouldBe("Short preview.");
    }

    [Test]
    public void ArticleSummary_Create_ValueTooLong_ThrowsArgumentException()
    {
        // Arrange
        var value = new string('a', 501);

        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleSummary.Create(value));

        // Assert
        exception.ParamName.ShouldBe("summary");
    }

    [Test]
    public void ArticleCategorySlug_Create_NormalizesToLowercase()
    {
        // Arrange
        const string value = "BackEnd-Architecture";

        // Act
        var slug = ArticleCategorySlug.Create(value);

        // Assert
        slug.Value.ShouldBe("backend-architecture");
        slug.ToString().ShouldBe("backend-architecture");
    }

    [TestCase("backend architecture")]
    [TestCase("backend_architecture")]
    [TestCase("backend--architecture")]
    public void ArticleCategorySlug_Create_InvalidValue_ThrowsArgumentException(string value)
    {
        // Arrange
        const string expectedParamName = "categorySlug";

        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleCategorySlug.Create(value));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }

    [Test]
    public void ArticleCategorySnapshot_Create_StoresSlugAndTrimmedDisplayName()
    {
        // Arrange
        var slug = ArticleCategorySlug.Create("backend");

        // Act
        var snapshot = ArticleCategorySnapshot.Create(slug, "  Backend  ");

        // Assert
        snapshot.Slug.Value.ShouldBe("backend");
        snapshot.DisplayName.ShouldBe("Backend");
    }

    [Test]
    public void MarkdownContent_Create_TrimsValue()
    {
        // Arrange
        const string value = "  # Title  ";

        // Act
        var content = MarkdownContent.Create(value);

        // Assert
        content.Value.ShouldBe("# Title");
        content.ToString().ShouldBe("# Title");
    }

    [Test]
    public void MarkdownContent_Create_ValueTooLong_ThrowsArgumentException()
    {
        // Arrange
        var value = new string('a', MarkdownContent.MaxLength + 1);

        // Act
        var exception = Should.Throw<ArgumentException>(() => MarkdownContent.Create(value));

        // Assert
        exception.ParamName.ShouldBe("bodyMarkdown");
    }

    [Test]
    public void ArticleTagSlug_Create_NormalizesToLowercase()
    {
        // Arrange
        const string value = "DotNet-10";

        // Act
        var slug = ArticleTagSlug.Create(value);

        // Assert
        slug.Value.ShouldBe("dotnet-10");
        slug.ToString().ShouldBe("dotnet-10");
    }

    [TestCase("dot net")]
    [TestCase("dot_net")]
    [TestCase("dotnet--10")]
    public void ArticleTagSlug_Create_InvalidValue_ThrowsArgumentException(string value)
    {
        // Arrange
        const string expectedParamName = "tagSlug";

        // Act
        var exception = Should.Throw<ArgumentException>(() => ArticleTagSlug.Create(value));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }

    [Test]
    public void ArticleTagSnapshot_Create_StoresSlugAndTrimmedDisplayName()
    {
        // Arrange
        var slug = ArticleTagSlug.Create("dotnet");

        // Act
        var snapshot = ArticleTagSnapshot.Create(slug, "  .NET  ");

        // Assert
        snapshot.Slug.Value.ShouldBe("dotnet");
        snapshot.DisplayName.ShouldBe(".NET");
    }

    [Test]
    public void RelatedProjectReference_Create_TrimsValues()
    {
        // Arrange
        const string projectId = "  smart-dev  ";
        const string label = "  Smart Dev  ";

        // Act
        var reference = RelatedProjectReference.Create(projectId, label);

        // Assert
        reference.ProjectId.ShouldBe("smart-dev");
        reference.Label.ShouldBe("Smart Dev");
    }

    [TestCase("", "Smart Dev", "projectId")]
    [TestCase("smart-dev", "   ", "label")]
    public void RelatedProjectReference_Create_MissingValue_ThrowsArgumentException(string projectId, string label, string expectedParamName)
    {
        // Arrange
        // Act
        var exception = Should.Throw<ArgumentException>(() => RelatedProjectReference.Create(projectId, label));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }
}
