using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Domain.Articles;

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
        try {
            var query = request.BindBaseQuery();
            var articles = await getPublicArticlesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, articles, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(OwnerArticles))]
    public async Task<HttpResponseData> OwnerArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", "options", Route = "owner/articles")] HttpRequestData request, CancellationToken cancellationToken)
    {
        if (string.Equals(request.Method, "GET", StringComparison.OrdinalIgnoreCase)) {
            return await GetOwnerArticlesAsync(request, cancellationToken);
        }

        if (string.Equals(request.Method, "POST", StringComparison.OrdinalIgnoreCase)) {
            return await CreateOwnerArticleAsync(request, cancellationToken);
        }

        return request.CreateResponse(HttpStatusCode.NoContent);
    }

    private async Task<HttpResponseData> GetOwnerArticlesAsync(HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery(defaultPageSize: 30, maxPageSize: 100);
            var articles = await getOwnerArticlesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, articles, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    private async Task<HttpResponseData> CreateOwnerArticleAsync(HttpRequestData request, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<CreateArticleRequest>(cancellationToken);
        if (body is null) return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse("Request body is required."), cancellationToken);

        try {
            var result = await createArticleHandler.HandleAsync(
                new CreateArticleCommand(
                    body.Title,
                    body.Slug,
                    body.Summary,
                    new CreateArticleCategory(body.Category.Slug, body.Category.DisplayName),
                    body.Tags.Select(tag => new CreateArticleTag(tag.Slug, tag.DisplayName)).ToArray(),
                    body.BodyMarkdown,
                    BindArticleStatus(body.Status),
                    BindArticleVisibility(body.Visibility)),
                cancellationToken);

            return await request.CreateJsonResponseAsync(HttpStatusCode.Created, new CreateArticleResponse(result.ArticleId, result.Slug), cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        } catch (InvalidOperationException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.Conflict, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(OwnerArticle))]
    public async Task<HttpResponseData> OwnerArticle([HttpTrigger(AuthorizationLevel.Anonymous, "get", "put", "options", Route = "owner/articles/{articleId:guid}")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse("Article id must be a valid GUID."), cancellationToken);
        if (string.Equals(request.Method, "GET", StringComparison.OrdinalIgnoreCase)) return await GetOwnerArticleByIdAsync(request, parsedArticleId, cancellationToken);
        if (string.Equals(request.Method, "PUT", StringComparison.OrdinalIgnoreCase)) return await UpdateOwnerArticleAsync(request, parsedArticleId, cancellationToken);
        return request.CreateResponse(HttpStatusCode.NoContent);
    }

    private async Task<HttpResponseData> GetOwnerArticleByIdAsync(HttpRequestData request, Guid articleId, CancellationToken cancellationToken)
    {
        var article = await getOwnerArticleByIdHandler.HandleAsync(articleId, cancellationToken);
        if (article is null) return await request.CreateJsonResponseAsync(HttpStatusCode.NotFound, new ArticlesErrorResponse("Article was not found."), cancellationToken);
        return await request.CreateJsonResponseAsync(HttpStatusCode.OK, article, cancellationToken);
    }

    private async Task<HttpResponseData> UpdateOwnerArticleAsync(HttpRequestData request, Guid articleId, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<UpdateArticleRequest>(cancellationToken);
        if (body is null) return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse("Request body is required."), cancellationToken);

        try {
            var result = await updateArticleHandler.HandleAsync(
                new UpdateArticleCommand(
                    articleId,
                    body.Title,
                    body.Slug,
                    body.Summary,
                    new CreateArticleCategory(body.Category.Slug, body.Category.DisplayName),
                    body.Tags.Select(tag => new CreateArticleTag(tag.Slug, tag.DisplayName)).ToArray(),
                    body.BodyMarkdown,
                    BindArticleStatus(body.Status),
                    BindArticleVisibility(body.Visibility)),
                cancellationToken);

            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, new UpdateArticleResponse(result.ArticleId, result.Slug), cancellationToken);
        } catch (KeyNotFoundException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.NotFound, new ArticlesErrorResponse(exception.Message), cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        } catch (InvalidOperationException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.Conflict, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(GetPublicArticleCategories))]
    public async Task<HttpResponseData> GetPublicArticleCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery();
            var categories = await getPublicArticleCategoriesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, categories, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(GetOwnerArticleCategories))]
    public async Task<HttpResponseData> GetOwnerArticleCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "owner/articles/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery();
            var categories = await getOwnerArticleCategoriesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, categories, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(GetPublicArticleTags))]
    public async Task<HttpResponseData> GetPublicArticleTags([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/tags")] HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery();
            var tags = await getPublicArticleTagsHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, tags, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(SearchPublicArticles))]
    public async Task<HttpResponseData> SearchPublicArticles([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/search")] HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery();
            var articles = await searchPublicArticlesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, articles, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(GetPublicArticleSearchIndex))]
    public async Task<HttpResponseData> GetPublicArticleSearchIndex([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/search-index")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var searchIndex = await getPublicArticleSearchIndexHandler.HandleAsync(cancellationToken);
        return await request.CreateJsonResponseAsync(HttpStatusCode.OK, searchIndex, cancellationToken);
    }

    [Function(nameof(GetPublicArticleById))]
    public async Task<HttpResponseData> GetPublicArticleById([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "articles/{articleId:guid}")] HttpRequestData request, string articleId, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(articleId, out var parsedArticleId)) return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new ArticlesErrorResponse("Article id must be a valid GUID."), cancellationToken);

        var article = await getPublicArticleByIdHandler.HandleAsync(parsedArticleId, cancellationToken);
        if (article is null) return await request.CreateJsonResponseAsync(HttpStatusCode.NotFound, new ArticlesErrorResponse("Article was not found."), cancellationToken);
        return await request.CreateJsonResponseAsync(HttpStatusCode.OK, article, cancellationToken);
    }


    private static ArticleStatus BindArticleStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return ArticleStatus.Draft;
        if (Enum.TryParse<ArticleStatus>(status, ignoreCase: true, out var parsedStatus)) return parsedStatus;
        throw new ArgumentException("Article status must be Draft, Published, or Archived.");
    }

    private static ArticleVisibility BindArticleVisibility(string? visibility)
    {
        if (string.IsNullOrWhiteSpace(visibility)) return ArticleVisibility.Private;
        if (Enum.TryParse<ArticleVisibility>(visibility, ignoreCase: true, out var parsedVisibility)) return parsedVisibility;
        throw new ArgumentException("Article visibility must be Private or Public.");
    }
}

public sealed record ArticlesErrorResponse(string Error);

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

public sealed record CreateArticleResponse(Guid ArticleId, string Slug);

public sealed record UpdateArticleRequest(
    string Title,
    string Slug,
    string Summary,
    CreateArticleCategoryRequest Category,
    IReadOnlyCollection<CreateArticleTagRequest> Tags,
    string BodyMarkdown,
    string? Status,
    string? Visibility);

public sealed record UpdateArticleResponse(Guid ArticleId, string Slug);
