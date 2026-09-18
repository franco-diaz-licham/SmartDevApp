using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Articles;
using SmartDev.Api.Functions.Domain.Common;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Messaging;

namespace SmartDev.Api.Functions.Application.Messaging;

public sealed class ArticleNarrationRequestedHandler(IArticleRepository articleRepository, IIntegrationEventPublisher integrationEventPublisher) : IDomainEventHandler
{
    public Type EventType => typeof(ArticleUpdatedEvent);

    public async Task HandleAsync(IDomainEvent domainEvent, CancellationToken cancellationToken)
    {
        if (domainEvent is not ArticleUpdatedEvent articleUpdated) throw new InvalidOperationException($"{nameof(ArticleNarrationRequestedHandler)} cannot handle {domainEvent.GetType().Name}.");

        var article = await articleRepository.GetByIdAsync(articleUpdated.ArticleId, cancellationToken);
        if (article is null || article.Status != ArticleStatus.Published || article.Visibility != ArticleVisibility.Public) return;
        var contentVersion = ArticleNarrationContent.CreateVersion(article.Title.Value, article.Summary.Value, article.Body.Value);

        await integrationEventPublisher.PublishAsync(
            new ArticleNarrationRequestedIntegrationEvent(
                article.Id.Value,
                contentVersion,
                article.Title.Value,
                article.Summary.Value,
                article.Body.Value,
                articleUpdated.OccurredAt),
            cancellationToken);
    }
}
