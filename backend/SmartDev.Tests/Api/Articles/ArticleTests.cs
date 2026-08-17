using SmartDev.Api.Functions.Domain.Articles;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Articles;

[TestFixture]
public sealed class ArticleTests
{
    [Test]
    public void CreateDraft_ValidDetails_CreatesPrivateDraft()
    {
        // Arrange
        var now = new DateTimeOffset(2026, 8, 5, 12, 0, 0, TimeSpan.Zero);

        // Act
        var article = CreateArticle(createdAt: now);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Draft);
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.CreatedAt.ShouldBeGreaterThan(DateTimeOffset.UtcNow.AddMinutes(-1));
        article.UpdatedAt.ShouldBeNull();
        article.PublishedAt.ShouldBeNull();
        article.ArchivedAt.ShouldBeNull();
        article.DomainEvents.OfType<ArticleCreatedEvent>().Count().ShouldBe(1);
    }

    [Test]
    public void Publish_DraftArticle_MakesPublishedAndPublic()
    {
        // Arrange
        var article = CreateArticle();
        var publishedAt = new DateTimeOffset(2026, 8, 5, 13, 0, 0, TimeSpan.Zero);

        // Act
        article.Publish(publishedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Published);
        article.Visibility.ShouldBe(ArticleVisibility.Public);
        article.PublishedAt.ShouldBe(publishedAt);
        article.UpdatedAt.ShouldBe(publishedAt);
        article.DomainEvents.OfType<ArticlePublishedEvent>().Count().ShouldBe(1);
    }

    [Test]
    public void ChangePublication_PublishedPrivateArticle_KeepsVisibilityIndependent()
    {
        // Arrange
        var article = CreateArticle();
        var changedAt = new DateTimeOffset(2026, 8, 5, 13, 30, 0, TimeSpan.Zero);

        // Act
        article.ChangePublication(ArticleStatus.Published, ArticleVisibility.Private, changedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Published);
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.PublishedAt.ShouldBe(changedAt);
        article.UpdatedAt.ShouldBe(changedAt);
        article.DomainEvents.OfType<ArticlePublishedEvent>().Count().ShouldBe(1);
    }

    [Test]
    public void CreateDraft_DuplicateTags_StoresUniqueTags()
    {
        // Act
        var article = CreateArticle(tags: ["dotnet", "azure-functions", "dotnet"]);

        // Assert
        article.Tags.Select(tag => tag.Slug.Value).ShouldBe(["dotnet", "azure-functions"]);
    }

    [TestCase("")]
    [TestCase("   ")]
    public void CreateDraft_TitleMissing_ThrowsArgumentException(string title)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(title: title));

        // Assert
        exception.ParamName.ShouldBe("title");
    }

    [TestCase("Azure Functions")]
    [TestCase("azure_functions")]
    [TestCase("azure--functions")]
    public void CreateDraft_InvalidSlug_ThrowsArgumentException(string slug)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(slug: slug));

        // Assert
        exception.ParamName.ShouldBe("slug");
    }

    [Test]
    public void CreateDraft_BodyTooLarge_ThrowsArgumentException()
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(bodyMarkdown: new string('a', MarkdownContent.MaxLength + 1)));

        // Assert
        exception.ParamName.ShouldBe("bodyMarkdown");
    }

    [Test]
    public void CreateDraft_TagsEmpty_ThrowsArgumentException()
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(tags: []));

        // Assert
        exception.ParamName.ShouldBe("tags");
    }
}
