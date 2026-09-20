using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Infrastructure.Storage;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleAudioById;

public sealed class GetPublicArticleAudioByIdHandler(IArticleRepository articleRepository, IFileStorage articleAudioStorage)
{
    public async Task<Result<ArticleAudioPlayback>> HandleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(articleId), cancellationToken);
        if (article is null || article.Status != ArticleStatus.Published || article.Visibility != ArticleVisibility.Public) {
            return Result<ArticleAudioPlayback>.Fail("Article was not found.", ResultTypeEnum.NotFound);
        }

        var contentVersion = ArticleNarrationContent.CreateVersion(article.Title.Value, article.Summary.Value, article.Body.Value);
        var audio = await articleAudioStorage.OpenReadAsync(article.Id.Value, contentVersion, cancellationToken);
        if (audio is null) return Result<ArticleAudioPlayback>.Fail("Article audio is not ready yet.", ResultTypeEnum.NotFound);

        return Result<ArticleAudioPlayback>.Success(new ArticleAudioPlayback(audio.Content, audio.ContentType, contentVersion));
    }
}
