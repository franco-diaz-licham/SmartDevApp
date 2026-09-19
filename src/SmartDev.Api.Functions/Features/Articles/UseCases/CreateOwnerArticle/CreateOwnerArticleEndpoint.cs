using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Common.Functions;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.CreateOwnerArticle;

public sealed class CreateOwnerArticleEndpoint(CreateOwnerArticleHandler handler)
{
    [Function(nameof(CreateOwnerArticle))]
    public async Task<HttpResponseData> CreateOwnerArticle([HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "owner/articles")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase)) return request.CreateResponse(HttpStatusCode.NoContent);

        var body = await request.ReadFromJsonAsync<CreateArticleRequest>(cancellationToken);
        if (body is null) return await Result<CreateArticleResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var command = body.ToCommandResult();
        if (!command.IsSuccess) return await command.ToHttpResponseAsync(request, cancellationToken);

        var result = await handler.HandleAsync(command.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}
