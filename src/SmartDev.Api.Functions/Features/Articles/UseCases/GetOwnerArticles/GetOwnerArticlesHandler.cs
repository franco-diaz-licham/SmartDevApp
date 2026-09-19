using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetOwnerArticles;

public sealed class GetOwnerArticlesHandler(IArticleRepository articleRepository)
{
    public async Task<Result<Page<PublicArticleListItem>>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var articles = await articleRepository.GetAllForOwnerAsync(query, cancellationToken);
        var response = new Page<PublicArticleListItem>(articles.Items.Select(PublicArticleListItem.FromDomain).ToArray(), articles.ContinuationToken);
        return Result<Page<PublicArticleListItem>>.Success(response);
    }
}
