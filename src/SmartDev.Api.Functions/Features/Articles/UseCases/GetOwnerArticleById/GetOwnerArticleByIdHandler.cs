using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetOwnerArticleById;

public sealed class GetOwnerArticleByIdHandler(IArticleRepository articleRepository)
{
    public async Task<Result<PublicArticleDetail>> HandleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(articleId), cancellationToken);
        return article is null
            ? Result<PublicArticleDetail>.Fail("Article was not found.", ResultTypeEnum.NotFound)
            : Result<PublicArticleDetail>.Success(PublicArticleDetail.FromDomain(article));
    }
}
