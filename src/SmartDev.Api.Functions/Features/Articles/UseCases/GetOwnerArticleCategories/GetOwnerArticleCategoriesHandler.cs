using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetOwnerArticleCategories;

public sealed class GetOwnerArticleCategoriesHandler(IArticleRepository articleRepository)
{
    public async Task<Result<Page<string>>> HandleAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var categories = await articleRepository.GetOwnerCategoryNamesAsync(query, cancellationToken);
        var response = new Page<string>(categories.Items.Order(StringComparer.OrdinalIgnoreCase).ToArray(), categories.ContinuationToken);
        return Result<Page<string>>.Success(response);
    }
}
