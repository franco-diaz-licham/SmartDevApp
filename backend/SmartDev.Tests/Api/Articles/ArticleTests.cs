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
        article.CreatedAt.ShouldBe(now);
        article.UpdatedAt.ShouldBeNull();
        article.PublishedAt.ShouldBeNull();
        article.ArchivedAt.ShouldBeNull();

        var createdEvent = article.DomainEvents.OfType<ArticleCreatedEvent>().Single();
        createdEvent.ArticleId.ShouldBe(article.Id);
        createdEvent.OccurredAt.ShouldBe(now);
    }

    [Test]
    public void Hydrate_PersistedState_RecreatesArticleWithoutDomainEvents()
    {
        // Arrange
        var id = ArticleId.New();
        var createdAt = new DateTimeOffset(2026, 8, 5, 10, 0, 0, TimeSpan.Zero);
        var updatedAt = new DateTimeOffset(2026, 8, 5, 11, 0, 0, TimeSpan.Zero);
        var publishedAt = new DateTimeOffset(2026, 8, 5, 12, 0, 0, TimeSpan.Zero);
        var archivedAt = new DateTimeOffset(2026, 8, 6, 12, 0, 0, TimeSpan.Zero);

        // Act
        var article = Article.Hydrate(
            id,
            ArticleTitle.Create("Persisted Article"),
            ArticleSlug.Create("persisted-article"),
            ArticleSummary.Create("Persisted summary."),
            ArticleCategorySnapshot.Create(ArticleCategorySlug.Create("backend"), "Backend"),
            MarkdownContent.Create("# Persisted"),
            ArticleStatus.Archived,
            ArticleVisibility.Private,
            [ArticleTagSnapshot.Create(ArticleTagSlug.Create("dotnet"), ".NET")],
            [RelatedProjectReference.Create("smart-dev", "Smart Dev")],
            createdAt,
            updatedAt,
            publishedAt,
            archivedAt);

        // Assert
        article.Id.ShouldBe(id);
        article.CreatedAt.ShouldBe(createdAt);
        article.UpdatedAt.ShouldBe(updatedAt);
        article.PublishedAt.ShouldBe(publishedAt);
        article.ArchivedAt.ShouldBe(archivedAt);
        article.Status.ShouldBe(ArticleStatus.Archived);
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.Tags.Single().Slug.Value.ShouldBe("dotnet");
        article.RelatedProjects.Single().ProjectId.ShouldBe("smart-dev");
        article.DomainEvents.ShouldBeEmpty();
    }

    [Test]
    public void Rename_ValidTitleAndSlug_UpdatesArticleAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 12, 30, 0, TimeSpan.Zero);

        // Act
        article.Rename(ArticleTitle.Create("New Title"), ArticleSlug.Create("new-title"), updatedAt);

        // Assert
        article.Title.Value.ShouldBe("New Title");
        article.Slug.Value.ShouldBe("new-title");
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void UpdateSummary_ValidSummary_UpdatesArticleAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 12, 35, 0, TimeSpan.Zero);

        // Act
        article.UpdateSummary(ArticleSummary.Create("Updated summary."), updatedAt);

        // Assert
        article.Summary.Value.ShouldBe("Updated summary.");
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void UpdateBody_ValidBody_UpdatesArticleAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 12, 40, 0, TimeSpan.Zero);

        // Act
        article.UpdateBody(MarkdownContent.Create("# Updated"), updatedAt);

        // Assert
        article.Body.Value.ShouldBe("# Updated");
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void ChangeCategory_ValidCategory_UpdatesArticleAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 12, 45, 0, TimeSpan.Zero);

        // Act
        article.ChangeCategory(ArticleCategorySnapshot.Create(ArticleCategorySlug.Create("frontend"), "Frontend"), updatedAt);

        // Assert
        article.Category.Slug.Value.ShouldBe("frontend");
        article.Category.DisplayName.ShouldBe("Frontend");
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void Publish_DraftArticle_MakesPublishedAndPublic()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var publishedAt = new DateTimeOffset(2026, 8, 5, 13, 0, 0, TimeSpan.Zero);

        // Act
        article.Publish(publishedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Published);
        article.Visibility.ShouldBe(ArticleVisibility.Public);
        article.PublishedAt.ShouldBe(publishedAt);
        article.UpdatedAt.ShouldBe(publishedAt);
        article.DomainEvents.OfType<ArticlePublishedEvent>().Single().OccurredAt.ShouldBe(publishedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(publishedAt);
    }

    [Test]
    public void Publish_PreviouslyPublishedArticle_PreservesOriginalPublishedAt()
    {
        // Arrange
        var article = CreateArticle();
        var firstPublishedAt = new DateTimeOffset(2026, 8, 5, 13, 0, 0, TimeSpan.Zero);
        var republishedAt = new DateTimeOffset(2026, 8, 5, 14, 0, 0, TimeSpan.Zero);
        article.Publish(firstPublishedAt);
        article.ClearDomainEvents();

        // Act
        article.Publish(republishedAt);

        // Assert
        article.PublishedAt.ShouldBe(firstPublishedAt);
        article.UpdatedAt.ShouldBe(republishedAt);
        article.DomainEvents.OfType<ArticlePublishedEvent>().Single().OccurredAt.ShouldBe(republishedAt);
    }

    [Test]
    public void ChangePublication_PublishedPrivateArticle_KeepsVisibilityIndependent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var changedAt = new DateTimeOffset(2026, 8, 5, 13, 30, 0, TimeSpan.Zero);

        // Act
        article.ChangePublication(ArticleStatus.Published, ArticleVisibility.Private, changedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Published);
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.PublishedAt.ShouldBe(changedAt);
        article.UpdatedAt.ShouldBe(changedAt);
        article.DomainEvents.OfType<ArticlePublishedEvent>().Single().OccurredAt.ShouldBe(changedAt);
    }

    [Test]
    public void ChangePublication_SameStatusAndVisibility_DoesNotRaiseEvents()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();

        // Act
        article.ChangePublication(ArticleStatus.Draft, ArticleVisibility.Private, new DateTimeOffset(2026, 8, 5, 13, 45, 0, TimeSpan.Zero));

        // Assert
        article.DomainEvents.ShouldBeEmpty();
        article.UpdatedAt.ShouldBeNull();
    }

    [Test]
    public void ChangePublication_ArchivedArticle_SetsArchivedAtAndRaisesArchivedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var archivedAt = new DateTimeOffset(2026, 8, 5, 14, 0, 0, TimeSpan.Zero);

        // Act
        article.ChangePublication(ArticleStatus.Archived, ArticleVisibility.Private, archivedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Archived);
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.ArchivedAt.ShouldBe(archivedAt);
        article.UpdatedAt.ShouldBe(archivedAt);
        article.DomainEvents.OfType<ArticleArchivedEvent>().Single().OccurredAt.ShouldBe(archivedAt);
    }

    [Test]
    public void ChangePublication_DraftArticle_ClearsPublishedAt()
    {
        // Arrange
        var article = CreateArticle();
        article.Publish(new DateTimeOffset(2026, 8, 5, 14, 0, 0, TimeSpan.Zero));
        article.ClearDomainEvents();
        var draftedAt = new DateTimeOffset(2026, 8, 5, 15, 0, 0, TimeSpan.Zero);

        // Act
        article.ChangePublication(ArticleStatus.Draft, ArticleVisibility.Private, draftedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Draft);
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.PublishedAt.ShouldBeNull();
        article.ArchivedAt.ShouldBeNull();
        article.UpdatedAt.ShouldBe(draftedAt);
    }

    [Test]
    public void MakePrivate_PublicArticle_ChangesVisibilityAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.Publish(new DateTimeOffset(2026, 8, 5, 13, 0, 0, TimeSpan.Zero));
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 13, 10, 0, TimeSpan.Zero);

        // Act
        article.MakePrivate(updatedAt);

        // Assert
        article.Visibility.ShouldBe(ArticleVisibility.Private);
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void MakePublic_PrivateArticle_ChangesVisibilityAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 13, 15, 0, TimeSpan.Zero);

        // Act
        article.MakePublic(updatedAt);

        // Assert
        article.Visibility.ShouldBe(ArticleVisibility.Public);
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void Archive_DraftArticle_SetsArchivedStateAndRaisesEvents()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var archivedAt = new DateTimeOffset(2026, 8, 5, 14, 30, 0, TimeSpan.Zero);

        // Act
        article.Archive(archivedAt);

        // Assert
        article.Status.ShouldBe(ArticleStatus.Archived);
        article.ArchivedAt.ShouldBe(archivedAt);
        article.UpdatedAt.ShouldBe(archivedAt);
        article.DomainEvents.OfType<ArticleArchivedEvent>().Single().OccurredAt.ShouldBe(archivedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(archivedAt);
    }

    [Test]
    public void CreateDraft_DuplicateTags_StoresUniqueTags()
    {
        // Arrange
        var tags = new[] { "dotnet", "azure-functions", "dotnet" };

        // Act
        var article = CreateArticle(tags: tags);

        // Assert
        article.Tags.Select(tag => tag.Slug.Value).ShouldBe(["dotnet", "azure-functions"]);
    }

    [Test]
    public void ReplaceTags_DuplicateTags_StoresUniqueTagsAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 15, 0, 0, TimeSpan.Zero);
        var tags = new[]
        {
            ArticleTagSnapshot.Create(ArticleTagSlug.Create("dotnet"), ".NET"),
            ArticleTagSnapshot.Create(ArticleTagSlug.Create("azure-functions"), "Azure Functions"),
            ArticleTagSnapshot.Create(ArticleTagSlug.Create("dotnet"), ".NET")
        };

        // Act
        article.ReplaceTags(tags, updatedAt);

        // Assert
        article.Tags.Select(tag => tag.Slug.Value).ShouldBe(["dotnet", "azure-functions"]);
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void LinkProject_NewProject_AddsProjectAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        article.ClearDomainEvents();
        var updatedAt = new DateTimeOffset(2026, 8, 5, 15, 30, 0, TimeSpan.Zero);
        var project = RelatedProjectReference.Create("smart-dev", "Smart Dev");

        // Act
        article.LinkProject(project, updatedAt);

        // Assert
        article.RelatedProjects.Single().ProjectId.ShouldBe("smart-dev");
        article.UpdatedAt.ShouldBe(updatedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(updatedAt);
    }

    [Test]
    public void LinkProject_ExistingProject_DoesNotRaiseUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        var linkedAt = new DateTimeOffset(2026, 8, 5, 15, 30, 0, TimeSpan.Zero);
        var relinkedAt = new DateTimeOffset(2026, 8, 5, 16, 0, 0, TimeSpan.Zero);
        article.LinkProject(RelatedProjectReference.Create("smart-dev", "Smart Dev"), linkedAt);
        article.ClearDomainEvents();
        var previousUpdatedAt = article.UpdatedAt;

        // Act
        article.LinkProject(RelatedProjectReference.Create("SMART-DEV", "Smart Dev"), relinkedAt);

        // Assert
        article.RelatedProjects.Count.ShouldBe(1);
        article.UpdatedAt.ShouldBe(previousUpdatedAt);
        article.DomainEvents.ShouldBeEmpty();
    }

    [Test]
    public void UnlinkProject_ExistingProject_RemovesProjectAndRaisesUpdatedEvent()
    {
        // Arrange
        var article = CreateArticle();
        var linkedAt = new DateTimeOffset(2026, 8, 5, 15, 30, 0, TimeSpan.Zero);
        var unlinkedAt = new DateTimeOffset(2026, 8, 5, 16, 30, 0, TimeSpan.Zero);
        article.LinkProject(RelatedProjectReference.Create("smart-dev", "Smart Dev"), linkedAt);
        article.ClearDomainEvents();

        // Act
        article.UnlinkProject(RelatedProjectReference.Create("SMART-DEV", "Smart Dev"), unlinkedAt);

        // Assert
        article.RelatedProjects.ShouldBeEmpty();
        article.UpdatedAt.ShouldBe(unlinkedAt);
        article.DomainEvents.OfType<ArticleUpdatedEvent>().Single().OccurredAt.ShouldBe(unlinkedAt);
    }

    [Test]
    public void SearchableText_IncludesContentMetadataTagsAndRelatedProjects()
    {
        // Arrange
        var article = CreateArticle();
        article.LinkProject(RelatedProjectReference.Create("smart-dev", "Smart Dev"), new DateTimeOffset(2026, 8, 5, 15, 30, 0, TimeSpan.Zero));

        // Act
        var searchableText = article.SearchableText;

        // Assert
        searchableText.ShouldContain("Azure Functions Articles");
        searchableText.ShouldContain("Useful articles about Azure Functions.");
        searchableText.ShouldContain("backend");
        searchableText.ShouldContain("Backend");
        searchableText.ShouldContain("azure-functions Azure Functions");
        searchableText.ShouldContain("dotnet .NET");
        searchableText.ShouldContain("Smart Dev");
        searchableText.ShouldContain("# Azure Functions");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void CreateDraft_TitleMissing_ThrowsArgumentException(string title)
    {
        // Arrange
        const string expectedParamName = "title";

        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(title: title));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }

    [TestCase("Azure Functions")]
    [TestCase("azure_functions")]
    [TestCase("azure--functions")]
    public void CreateDraft_InvalidSlug_ThrowsArgumentException(string slug)
    {
        // Arrange
        const string expectedParamName = "slug";

        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(slug: slug));

        // Assert
        exception.ParamName.ShouldBe(expectedParamName);
    }

    [Test]
    public void CreateDraft_BodyTooLarge_ThrowsArgumentException()
    {
        // Arrange
        var bodyMarkdown = new string('a', MarkdownContent.MaxLength + 1);

        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(bodyMarkdown: bodyMarkdown));

        // Assert
        exception.ParamName.ShouldBe("bodyMarkdown");
    }

    [Test]
    public void CreateDraft_TagsEmpty_ThrowsArgumentException()
    {
        // Arrange
        var tags = Array.Empty<string>();

        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateArticle(tags: tags));

        // Assert
        exception.ParamName.ShouldBe("tags");
    }
}
