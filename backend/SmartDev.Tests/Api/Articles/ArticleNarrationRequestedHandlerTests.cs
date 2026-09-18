using SmartDev.Api.Functions.Application.Messaging;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Domain.Articles;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Messaging;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Articles;

[TestFixture]
public sealed class ArticleNarrationRequestedHandlerTests
{
    [Test]
    public async Task HandleAsync_PublishedPublicArticle_PublishesNarrationRequest()
    {
        // Arrange
        var article = CreateArticle();
        article.ChangePublication(ArticleStatus.Published, ArticleVisibility.Public, DateTimeOffset.UtcNow);
        var publisher = new RecordingIntegrationEventPublisher();
        var handler = new ArticleNarrationRequestedHandler(new StubArticleRepository(article), publisher);

        // Act
        await handler.HandleAsync(new ArticleUpdatedEvent(article.Id, DateTimeOffset.UtcNow), CancellationToken.None);

        // Assert
        var message = publisher.Messages.Single().ShouldBeOfType<ArticleNarrationRequestedIntegrationEvent>();
        message.ArticleId.ShouldBe(article.Id.Value);
        message.Title.ShouldBe(article.Title.Value);
        message.Summary.ShouldBe(article.Summary.Value);
        message.BodyMarkdown.ShouldBe(article.Body.Value);
        message.ContentVersion.ShouldBe(ArticleNarrationContent.CreateVersion(article.Title.Value, article.Summary.Value, article.Body.Value));
    }

    [Test]
    public async Task HandleAsync_PrivateArticle_DoesNotPublishNarrationRequest()
    {
        // Arrange
        var article = CreateArticle();
        var publisher = new RecordingIntegrationEventPublisher();
        var handler = new ArticleNarrationRequestedHandler(new StubArticleRepository(article), publisher);

        // Act
        await handler.HandleAsync(new ArticleUpdatedEvent(article.Id, DateTimeOffset.UtcNow), CancellationToken.None);

        // Assert
        publisher.Messages.ShouldBeEmpty();
    }

    private sealed class RecordingIntegrationEventPublisher : IIntegrationEventPublisher
    {
        public List<object> Messages { get; } = [];

        public Task PublishAsync<TIntegrationEventModel>(TIntegrationEventModel integrationEventModel, CancellationToken cancellationToken = default)
            where TIntegrationEventModel : class
        {
            Messages.Add(integrationEventModel);
            return Task.CompletedTask;
        }
    }

    private sealed class StubArticleRepository(Article article) : IArticleRepository
    {
        public Task<Article?> GetByIdAsync(ArticleId id, CancellationToken cancellationToken) => Task.FromResult<Article?>(article.Id == id ? article : null);

        public Task<DocumentPage<Article>> GetPublishedPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<IReadOnlyCollection<Article>> GetPublishedPublicArticlesAsync(CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<DocumentPage<Article>> SearchPublishedPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<DocumentPage<string>> GetPublishedPublicCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<DocumentPage<string>> GetOwnerCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<DocumentPage<string>> GetPublishedPublicTagNamesAsync(BaseQuery query, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<DocumentPage<Article>> GetAllForOwnerAsync(BaseQuery query, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task AddAsync(Article article, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task SaveAsync(Article article, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
