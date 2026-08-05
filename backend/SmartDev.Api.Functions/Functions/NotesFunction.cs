using System.Net;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Functions;

public sealed class NotesFunction(
    GetPublicNotesHandler getPublicNotesHandler,
    GetPublicNoteBySlugHandler getPublicNoteBySlugHandler,
    GetPublicNoteCategoriesHandler getPublicNoteCategoriesHandler,
    GetPublicNoteTagsHandler getPublicNoteTagsHandler,
    SearchPublicNotesHandler searchPublicNotesHandler,
    GetPublicNoteSearchIndexHandler getPublicNoteSearchIndexHandler)
{
    [Function(nameof(GetPublicNotes))]
    public async Task<HttpResponseData> GetPublicNotes([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var notes = await getPublicNotesHandler.HandleAsync(cancellationToken);
        return await CreateJsonResponseAsync(request, HttpStatusCode.OK, notes, cancellationToken);
    }

    [Function(nameof(GetPublicNoteCategories))]
    public async Task<HttpResponseData> GetPublicNoteCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var categories = await getPublicNoteCategoriesHandler.HandleAsync(cancellationToken);
        return await CreateJsonResponseAsync(request, HttpStatusCode.OK, categories, cancellationToken);
    }

    [Function(nameof(GetPublicNoteTags))]
    public async Task<HttpResponseData> GetPublicNoteTags([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/tags")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var tags = await getPublicNoteTagsHandler.HandleAsync(cancellationToken);
        return await CreateJsonResponseAsync(request, HttpStatusCode.OK, tags, cancellationToken);
    }

    [Function(nameof(SearchPublicNotes))]
    public async Task<HttpResponseData> SearchPublicNotes([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/search")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var query = HttpUtility.ParseQueryString(request.Url.Query).Get("q") ?? string.Empty;
        var notes = await searchPublicNotesHandler.HandleAsync(query, cancellationToken);
        return await CreateJsonResponseAsync(request, HttpStatusCode.OK, notes, cancellationToken);
    }

    [Function(nameof(GetPublicNoteSearchIndex))]
    public async Task<HttpResponseData> GetPublicNoteSearchIndex([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/search-index")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var searchIndex = await getPublicNoteSearchIndexHandler.HandleAsync(cancellationToken);
        return await CreateJsonResponseAsync(request, HttpStatusCode.OK, searchIndex, cancellationToken);
    }

    [Function(nameof(GetPublicNoteBySlug))]
    public async Task<HttpResponseData> GetPublicNoteBySlug([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/{slug}")] HttpRequestData request, string slug, CancellationToken cancellationToken)
    {
        try {
            var note = await getPublicNoteBySlugHandler.HandleAsync(slug, cancellationToken);
            if (note is null) return await CreateJsonResponseAsync(request, HttpStatusCode.NotFound, new NotesErrorResponse("Note was not found."), cancellationToken);
            return await CreateJsonResponseAsync(request, HttpStatusCode.OK, note, cancellationToken);
        } catch (ArgumentException exception) {
            return await CreateJsonResponseAsync(request, HttpStatusCode.BadRequest, new NotesErrorResponse(exception.Message), cancellationToken);
        }
    }

    private static async Task<HttpResponseData> CreateJsonResponseAsync<TResponse>(
        HttpRequestData request,
        HttpStatusCode statusCode,
        TResponse body,
        CancellationToken cancellationToken)
    {
        var response = request.CreateResponse(statusCode);
        await response.WriteAsJsonAsync(body, cancellationToken);
        return response;
    }
}

public sealed record NotesErrorResponse(string Error);
