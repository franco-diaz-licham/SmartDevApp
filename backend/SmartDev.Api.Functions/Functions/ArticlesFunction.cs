using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Functions;

public sealed class ArticlesFunction(
    GetPublicArticlesHandler getPublicArticlesHandler,
    GetOwnerArticlesHandler getOwnerArticlesHandler,
    GetOwnerArticleByIdHandler getOwnerArticleByIdHandler,
    GetPublicArticleByIdHandler getPublicArticleByIdHandler,
    GetPublicArticleCategoriesHandler getPublicArticleCategoriesHandler,
    GetOwnerArticleCategoriesHandler getOwnerArticleCategoriesHandler,
    GetPublicArticleTagsHandler getPublicArticleTagsHandler,
    SearchPublicArticlesHandler searchPublicArticlesHandler,
    GetPublicArticleSearchIndexHandler getPublicArticleSearchIndexHandler,
    CreateArticleHandler createArticleHandler,
    UpdateArticleHandler updateArticleHandler)
{
    [Function(nameof(GetPublicArticles))]
    public async Task<HttpResponseData> GetPublicArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await getPublicArticlesHandler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(OwnerArticles))]
    public async Task<HttpResponseData> OwnerArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", "options", Route = "owner/articles")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "GET", StringComparison.OrdinalIgnoreCase)) return await GetOwnerArticlesAsync(request, cancellationToken);
        if (string.Equals(request.Method, "POST", StringComparison.OrdinalIgnoreCase)) return await CreateOwnerArticleAsync(request, cancellationToken);
        return request.CreateResponse(HttpStatusCode.NoContent);
    }

    private async Task<HttpResponseData> GetOwnerArticlesAsync(HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult(defaultPageSize: 30, maxPageSize: 100);
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await getOwnerArticlesHandler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    private async Task<HttpResponseData> CreateOwnerArticleAsync(HttpRequestData request, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<CreateArticleRequest>(cancellationToken);
        if (body is null) return await Result<CreateArticleResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var command = body.ToCommandResult();
        if (!command.IsSuccess) return await command.ToHttpResponseAsync(request, cancellationToken);

        var result = await createArticleHandler.HandleAsync(command.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(OwnerArticle))]
    public async Task<HttpResponseData> OwnerArticle([HttpTrigger(AuthorizationLevel.Anonymous, "get", "put", "options", Route = "owner/articles/{articleId:guid}")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await Result.Fail("Article id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);
        if (string.Equals(request.Method, "GET", StringComparison.OrdinalIgnoreCase)) return await GetOwnerArticleByIdAsync(request, parsedArticleId, cancellationToken);
        if (string.Equals(request.Method, "PUT", StringComparison.OrdinalIgnoreCase)) return await UpdateOwnerArticleAsync(request, parsedArticleId, cancellationToken);
        return request.CreateResponse(HttpStatusCode.NoContent);
    }

    private async Task<HttpResponseData> GetOwnerArticleByIdAsync(HttpRequestData request, Guid articleId, CancellationToken cancellationToken)
    {
        var result = await getOwnerArticleByIdHandler.HandleAsync(articleId, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    private async Task<HttpResponseData> UpdateOwnerArticleAsync(HttpRequestData request, Guid articleId, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<UpdateArticleRequest>(cancellationToken);
        if (body is null) return await Result<UpdateArticleResult>.Fail("Request body is required.").ToHttpResponseAsync(request, cancellationToken);

        var command = body.ToCommandResult(articleId);
        if (!command.IsSuccess) return await command.ToHttpResponseAsync(request, cancellationToken);

        var result = await updateArticleHandler.HandleAsync(command.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(GetPublicArticleCategories))]
    public async Task<HttpResponseData> GetPublicArticleCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await getPublicArticleCategoriesHandler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(GetOwnerArticleCategories))]
    public async Task<HttpResponseData> GetOwnerArticleCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "owner/articles/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await getOwnerArticleCategoriesHandler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(GetPublicArticleTags))]
    public async Task<HttpResponseData> GetPublicArticleTags([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/tags")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await getPublicArticleTagsHandler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(SearchPublicArticles))]
    public async Task<HttpResponseData> SearchPublicArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/search")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = request.BindBaseQueryResult();
        if (!query.IsSuccess) return await query.ToHttpResponseAsync(request, cancellationToken);

        var result = await searchPublicArticlesHandler.HandleAsync(query.Value!, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(GetPublicArticleSearchIndex))]
    public async Task<HttpResponseData> GetPublicArticleSearchIndex([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/search-index")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var result = await getPublicArticleSearchIndexHandler.HandleAsync(cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }

    [Function(nameof(GetPublicArticleById))]
    public async Task<HttpResponseData> GetPublicArticleById([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/{articleId:guid}")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await Result.Fail("Article id must be a valid GUID.").ToHttpResponseAsync(request, cancellationToken);

        var result = await getPublicArticleByIdHandler.HandleAsync(parsedArticleId, cancellationToken);
        return await result.ToHttpResponseAsync(request, cancellationToken);
    }
}

public sealed record CreateArticleRequest(
    string Title,
    string Slug,
    string Summary,
    CreateArticleCategoryRequest Category,
    IReadOnlyCollection<CreateArticleTagRequest> Tags,
    string BodyMarkdown,
    string? Status,
    string? Visibility);

public sealed record CreateArticleCategoryRequest(string Slug, string DisplayName);

public sealed record CreateArticleTagRequest(string Slug, string DisplayName);

public sealed record UpdateArticleRequest(
    string Title,
    string Slug,
    string Summary,
    CreateArticleCategoryRequest Category,
    IReadOnlyCollection<CreateArticleTagRequest> Tags,
    string BodyMarkdown,
    string? Status,
    string? Visibility);
