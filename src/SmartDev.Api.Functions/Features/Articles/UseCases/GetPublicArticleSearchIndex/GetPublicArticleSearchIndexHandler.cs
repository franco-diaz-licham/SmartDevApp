using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleSearchIndex;

public sealed class GetPublicArticleSearchIndexHandler(IArticleRepository articleRepository)
{
    public async Task<Result<PublicSearchIndexResponse>> HandleAsync(CancellationToken cancellationToken)
    {
        var articles = await articleRepository.GetPublishedPublicArticlesAsync(cancellationToken);
        var response = new PublicSearchIndexResponse(
            DateTimeOffset.UtcNow,
            articles.Select(PublicArticleSearchDocument.FromDomain).ToArray());

        return Result<PublicSearchIndexResponse>.Success(response);
    }
}
