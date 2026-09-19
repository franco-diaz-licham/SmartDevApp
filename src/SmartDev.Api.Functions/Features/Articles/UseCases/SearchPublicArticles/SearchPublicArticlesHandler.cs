using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.SearchPublicArticles;

public sealed class SearchPublicArticlesHandler(IArticleRepository articleRepository)
{
    public async Task<Result<Page<PublicArticleListItem>>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query.SearchTerm)) {
            return Result<Page<PublicArticleListItem>>.Success(new Page<PublicArticleListItem>([], null));
        }

        var articles = await articleRepository.SearchPublishedPublicArticlesAsync(query, cancellationToken);
        var response = new Page<PublicArticleListItem>(articles.Items.Select(PublicArticleListItem.FromDomain).ToArray(), articles.ContinuationToken);
        return Result<Page<PublicArticleListItem>>.Success(response);
    }
}
