using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Infrastructure.Storage;
using SmartDev.Shared.Messaging;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GenerateOwnerArticleAudio;

public sealed class GenerateOwnerArticleAudioHandler(
    IArticleRepository articleRepository,
    IAudioStorage articleAudioStorage,
    IIntegrationEventPublisher integrationEventPublisher)
{
    public async Task<Result<ArticleAudioGenerationRequest>> HandleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(articleId), cancellationToken);
        if (article is null) {
            return Result<ArticleAudioGenerationRequest>.Fail("Article was not found.", ResultTypeEnum.NotFound);
        }

        var contentVersion = ArticleNarrationContent.CreateVersion(article.Title.Value, article.Summary.Value, article.Body.Value);
        var existingAudio = await articleAudioStorage.OpenReadAsync(article.Id.Value, contentVersion, cancellationToken);
        if (existingAudio is not null) {
            await existingAudio.Content.DisposeAsync();
            return Result<ArticleAudioGenerationRequest>.Success(new ArticleAudioGenerationRequest("ready", contentVersion));
        }

        await integrationEventPublisher.PublishAsync(
            new ArticleNarrationRequestedIntegrationEvent(
                article.Id.Value,
                contentVersion,
                article.Title.Value,
                article.Summary.Value,
                article.Body.Value,
                DateTimeOffset.UtcNow),
            cancellationToken);

        return Result<ArticleAudioGenerationRequest>.Success(new ArticleAudioGenerationRequest("queued", contentVersion), ResultTypeEnum.Accepted);
    }
}
