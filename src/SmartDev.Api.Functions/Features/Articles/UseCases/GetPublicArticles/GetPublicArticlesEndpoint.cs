using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticles;

public sealed class GetPublicArticlesEndpoint(GetPublicArticlesHandler handler)
{
    [Function(nameof(GetPublicArticles))]
    public async Task<HttpResponseData> GetPublicArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
