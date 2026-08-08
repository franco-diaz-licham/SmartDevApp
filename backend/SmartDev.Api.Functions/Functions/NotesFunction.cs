using System.Net;
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
    GetPublicNoteSearchIndexHandler getPublicNoteSearchIndexHandler,
    CreateNoteHandler createNoteHandler)
{
    [Function(nameof(GetPublicNotes))]
    public async Task<HttpResponseData> GetPublicNotes([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes")] HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery();
            var notes = await getPublicNotesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, notes, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new NotesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(CreateOwnerNote))]
    public async Task<HttpResponseData> CreateOwnerNote([HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "owner/notes")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var body = await request.ReadFromJsonAsync<CreateNoteRequest>(cancellationToken);
        if (body is null) return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new NotesErrorResponse("Request body is required."), cancellationToken);

        try {
            var result = await createNoteHandler.HandleAsync(
                new CreateNoteCommand(
                    body.Title,
                    body.Slug,
                    body.Summary,
                    new CreateNoteCategory(body.Category.Slug, body.Category.DisplayName),
                    body.Tags.Select(tag => new CreateNoteTag(tag.Slug, tag.DisplayName)).ToArray(),
                    body.BodyMarkdown),
                cancellationToken);

            return await request.CreateJsonResponseAsync(HttpStatusCode.Created, new CreateNoteResponse(result.NoteId, result.Slug), cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new NotesErrorResponse(exception.Message), cancellationToken);
        } catch (InvalidOperationException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.Conflict, new NotesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(GetPublicNoteCategories))]
    public async Task<HttpResponseData> GetPublicNoteCategories([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/categories")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var categories = await getPublicNoteCategoriesHandler.HandleAsync(cancellationToken);
        return await request.CreateJsonResponseAsync(HttpStatusCode.OK, categories, cancellationToken);
    }

    [Function(nameof(GetPublicNoteTags))]
    public async Task<HttpResponseData> GetPublicNoteTags([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/tags")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var tags = await getPublicNoteTagsHandler.HandleAsync(cancellationToken);
        return await request.CreateJsonResponseAsync(HttpStatusCode.OK, tags, cancellationToken);
    }

    [Function(nameof(SearchPublicNotes))]
    public async Task<HttpResponseData> SearchPublicNotes([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/search")] HttpRequestData request, CancellationToken cancellationToken)
    {
        try {
            var query = request.BindBaseQuery();
            var notes = await searchPublicNotesHandler.HandleAsync(query, cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, notes, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new NotesErrorResponse(exception.Message), cancellationToken);
        }
    }

    [Function(nameof(GetPublicNoteSearchIndex))]
    public async Task<HttpResponseData> GetPublicNoteSearchIndex([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/search-index")] HttpRequestData request, CancellationToken cancellationToken)
    {
        var searchIndex = await getPublicNoteSearchIndexHandler.HandleAsync(cancellationToken);
        return await request.CreateJsonResponseAsync(HttpStatusCode.OK, searchIndex, cancellationToken);
    }

    [Function(nameof(GetPublicNoteBySlug))]
    public async Task<HttpResponseData> GetPublicNoteBySlug([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "notes/{slug}")] HttpRequestData request, string slug, CancellationToken cancellationToken)
    {
        try {
            var note = await getPublicNoteBySlugHandler.HandleAsync(slug, cancellationToken);
            if (note is null) return await request.CreateJsonResponseAsync(HttpStatusCode.NotFound, new NotesErrorResponse("Note was not found."), cancellationToken);
            return await request.CreateJsonResponseAsync(HttpStatusCode.OK, note, cancellationToken);
        } catch (ArgumentException exception) {
            return await request.CreateJsonResponseAsync(HttpStatusCode.BadRequest, new NotesErrorResponse(exception.Message), cancellationToken);
        }
    }


}

public sealed record NotesErrorResponse(string Error);

public sealed record CreateNoteRequest(
    string Title,
    string Slug,
    string Summary,
    CreateNoteCategoryRequest Category,
    IReadOnlyCollection<CreateNoteTagRequest> Tags,
    string BodyMarkdown);

public sealed record CreateNoteCategoryRequest(string Slug, string DisplayName);

public sealed record CreateNoteTagRequest(string Slug, string DisplayName);

public sealed record CreateNoteResponse(Guid NoteId, string Slug);
