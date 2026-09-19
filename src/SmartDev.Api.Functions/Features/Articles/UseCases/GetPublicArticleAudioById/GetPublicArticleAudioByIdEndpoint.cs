using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.GetPublicArticleAudioById;

public sealed class GetPublicArticleAudioByIdEndpoint(GetPublicArticleAudioByIdHandler handler)
{
    [Function(nameof(GetPublicArticleAudioById))]
    public async Task<HttpResponseData> GetPublicArticleAudioById([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/{articleId:guid}/audio")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await Result.Fail("Article id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(parsedArticleId, cancellationToken);
        if (!result.IsSuccess) return await result.ToHttpResponseAsync(request, cancellationToken);

        var response = request.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", result.Value!.ContentType);
        response.Headers.Add("Cache-Control", "no-cache");
        response.Headers.Add("ETag", $"\"{result.Value.ContentVersion}\"");
        await result.Value.Content.CopyToAsync(response.Body, cancellationToken);
        await result.Value.Content.DisposeAsync();
        return response;
    }
}
