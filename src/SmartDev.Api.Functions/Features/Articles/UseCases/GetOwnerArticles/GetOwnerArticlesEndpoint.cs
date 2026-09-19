using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetOwnerArticles;

public sealed class GetOwnerArticlesEndpoint(GetOwnerArticlesHandler handler)
{
    [Function(nameof(GetOwnerArticles))]
    public async Task<HttpResponseData> GetOwnerArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "owner/articles")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult(defaultPageSize: 30, maxPageSize: 100);
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
