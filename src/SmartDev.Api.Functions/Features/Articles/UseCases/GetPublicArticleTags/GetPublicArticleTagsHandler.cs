using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleTags;

public sealed class GetPublicArticleTagsHandler(IArticleRepository articleRepository)
{
    public async Task<Result<Page<string>>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var tags = await articleRepository.GetPublishedPublicTagNamesAsync(query, cancellationToken);
        var response = new Page<string>(tags.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), tags.ContinuationToken);
        return Result<Page<string>>.Success(response);
    }
}
