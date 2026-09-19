using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleSearchIndex;

public sealed class GetPublicArticleSearchIndexEndpoint(GetPublicArticleSearchIndexHandler handler)
{
    [Function(nameof(GetPublicArticleSearchIndex))]
    public async Task<HttpResponseData> GetPublicArticleSearchIndex([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/search-index")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        var result = await handler.HandleAsync(cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
