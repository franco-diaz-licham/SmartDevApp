using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleCategories;

public sealed class GetPublicArticleCategoriesHandler(IArticleRepository articleRepository)
{
    public async Task<Result<Page<string>>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var categories = await articleRepository.GetPublishedPublicCategoryNamesAsync(query, cancellationToken);
        var response = new Page<string>(categories.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), categories.ContinuationToken);
        return Result<Page<string>>.Success(response);
    }
}
