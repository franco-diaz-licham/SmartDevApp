using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GenerateOwnerArticleAudio;

public sealed class GenerateOwnerArticleAudioEndpoint(GenerateOwnerArticleAudioHandler handler)
{
    [Function(nameof(GenerateOwnerArticleAudio))]
    public async Task<HttpResponseData> GenerateOwnerArticleAudio([HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "owner/articles/{articleId:guid}/audio")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await Result.Fail("Article id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(parsedArticleId, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
