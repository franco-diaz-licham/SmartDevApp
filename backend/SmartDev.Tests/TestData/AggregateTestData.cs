using SmartDev.Api.Functions.Domain.Contact;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Tests.TestData;

internal static class AggregateTestData
{
    public static ContactMessage CreateContactMessage(
        string senderName = "Ada Lovelace",
        string senderEmail = "ada@example.com",
        string message = "Hello",
        DateTimeOffset? submittedAt = null)
    {
        return ContactMessage.Create(
            senderName: senderName,
            senderEmail: senderEmail,
            message: message,
            submittedAt: submittedAt ?? DateTimeOffset.UtcNow);
    }

    public static Note CreateNote(
        string title = "Azure Functions Notes",
        string slug = "azure-functions-notes",
        string summary = "Useful notes about Azure Functions.",
        string category = "Backend",
        string bodyMarkdown = "# Azure Functions\n\nNotes.",
        IEnumerable<string>? tags = null,
        DateTimeOffset? createdAt = null)
    {
        return Note.CreateDraft(
            id: NoteId.New(),
            title: NoteTitle.Create(title),
            slug: NoteSlug.Create(slug),
            summary: NoteSummary.Create(summary),
            category: NoteCategorySnapshot.Create(NoteCategorySlug.Create(ToSlug(category)), category.Trim()),
            body: MarkdownContent.Create(bodyMarkdown),
            tags: (tags ?? ["azure-functions", "dotnet"])
                .Select(tag => NoteTagSnapshot.Create(NoteTagSlug.Create(tag), ToDisplayName(tag))),
            relatedProjects: [],
            now: createdAt ?? DateTimeOffset.UtcNow);
    }

    public static NoteCategory CreateNoteCategory(string slug = "backend", string displayName = "Backend")
    {
        return NoteCategory.Create(NoteCategorySlug.Create(slug), displayName);
    }

    public static NoteTag CreateNoteTag(string slug = "dotnet", string displayName = ".NET", IEnumerable<string>? aliases = null)
    {
        return NoteTag.Create(NoteTagSlug.Create(slug), displayName, aliases);
    }

    private static string ToSlug(string value)
    {
        return value.Trim().ToLowerInvariant().Replace(" ", "-");
    }

    private static string ToDisplayName(string slug)
    {
        return slug switch {
            "dotnet" => ".NET",
            "azure-functions" => "Azure Functions",
            _ => slug.Trim()
        };
    }
}
