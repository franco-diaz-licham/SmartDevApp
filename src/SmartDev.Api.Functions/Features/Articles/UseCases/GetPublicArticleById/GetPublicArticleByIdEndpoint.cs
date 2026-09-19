using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleById;

public sealed class GetPublicArticleByIdEndpoint(GetPublicArticleByIdHandler handler)
{
    [Function(nameof(GetPublicArticleById))]
    public async Task<HttpResponseData> GetPublicArticleById([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/{articleId:guid}")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await Result.Fail("Article id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(parsedArticleId, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
