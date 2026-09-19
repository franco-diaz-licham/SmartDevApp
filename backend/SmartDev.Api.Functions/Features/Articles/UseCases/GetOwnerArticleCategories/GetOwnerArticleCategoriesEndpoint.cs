using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetOwnerArticleCategories;

public sealed class GetOwnerArticleCategoriesEndpoint(GetOwnerArticleCategoriesHandler handler)
{
    [Function(nameof(GetOwnerArticleCategories))]
    public async Task<HttpResponseData> GetOwnerArticleCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "owner/articles/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
