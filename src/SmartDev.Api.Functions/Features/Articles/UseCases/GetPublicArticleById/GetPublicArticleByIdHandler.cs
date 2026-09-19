using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleById;

public sealed class GetPublicArticleByIdHandler(IArticleRepository articleRepository)
{
    public async Task<Result<PublicArticleDetail>> HandleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(articleId), cancellationToken);
        if (article is null || article.Status != ArticleStatus.Published || article.Visibility != ArticleVisibility.Public) {
            return Result<PublicArticleDetail>.Fail("Article was not found.", ResultTypeEnum.NotFound);
        }

        return Result<PublicArticleDetail>.Success(PublicArticleDetail.FromDomain(article));
    }
}
