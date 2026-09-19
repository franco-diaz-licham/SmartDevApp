using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.UpdateOwnerArticle;

public sealed class UpdateOwnerArticleEndpoint(UpdateOwnerArticleHandler handler)
{
    [Function(nameof(UpdateOwnerArticle))]
    public async Task<HttpResponseData> UpdateOwnerArticle([HttpTrigger(AuthorizationLevel.Anonymous, "put", "options", Route = "owner/articles/{articleId:guid}")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await Result.Fail("Article id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var body = await request.ReadFromJsonAsync<UpdateArticleRequest>(cancellationToken);
        if (body is null) return await Result<UpdateArticleResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var command = body.ToCommandResult(parsedArticleId);
        if (!command.IsSuccess) return await command.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(command.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
