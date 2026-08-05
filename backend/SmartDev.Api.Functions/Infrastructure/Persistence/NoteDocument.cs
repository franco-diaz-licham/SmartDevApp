using Newtonsoft.Json;
using SmartDev.Api.Functions.Domain.Notes;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class NoteDocument
{
    public const string ContainerName = "notes";
    public const string DocumentType = "note";
    public const string PartitionKeyPath = "/visibility";
    public const string PublicPartitionKey = "Public";
    public const string PrivatePartitionKey = "Private";

    [JsonProperty("id")]
    public string Id { get; init; } = string.Empty;

    public string Type { get; init; } = DocumentType;

    public string Slug { get; init; } = string.Empty;

    public string Title { get; init; } = string.Empty;

    public string Summary { get; init; } = string.Empty;

    public NoteCategoryDocument Category { get; init; } = new(string.Empty, string.Empty);

    public IReadOnlyCollection<NoteTagDocument> Tags { get; init; } = [];

    public string BodyMarkdown { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string Visibility { get; init; } = string.Empty;

    public IReadOnlyCollection<RelatedProjectDocument> RelatedProjects { get; init; } = [];

    public DateTimeOffset CreatedAt { get; init; }

    public DateTimeOffset? UpdatedAt { get; init; }

    public DateTimeOffset? PublishedAt { get; init; }

    public DateTimeOffset? ArchivedAt { get; init; }

    public static NoteDocument FromDomain(Note note)
    {
        return new NoteDocument {
            Id = note.Id.Value.ToString("D"),
            Slug = note.Slug.Value,
            Title = note.Title.Value,
            Summary = note.Summary.Value,
            Category = new NoteCategoryDocument(note.Category.Slug.Value, note.Category.DisplayName),
            Tags = note.Tags.Select(tag => new NoteTagDocument(tag.Slug.Value, tag.DisplayName)).ToArray(),
            BodyMarkdown = note.Body.Value,
            Status = note.Status.ToString(),
            Visibility = note.Visibility.ToString(),
            RelatedProjects = note.RelatedProjects
                .Select(project => new RelatedProjectDocument(project.ProjectId, project.Label))
                .ToArray(),
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt,
            PublishedAt = note.PublishedAt,
            ArchivedAt = note.ArchivedAt
        };
    }

    public Note ToDomain()
    {
        return Note.Hydrate(
            NoteId.From(Guid.Parse(Id)),
            NoteTitle.Create(Title),
            NoteSlug.Create(Slug),
            NoteSummary.Create(Summary),
            NoteCategorySnapshot.Create(NoteCategorySlug.Create(Category.Slug), Category.DisplayName),
            MarkdownContent.Create(BodyMarkdown),
            Enum.Parse<NoteStatus>(Status),
            Enum.Parse<NoteVisibility>(Visibility),
            Tags.Select(tag => NoteTagSnapshot.Create(NoteTagSlug.Create(tag.Slug), tag.DisplayName)),
            RelatedProjects.Select(project => RelatedProjectReference.Create(project.ProjectId, project.Label)),
            CreatedAt,
            UpdatedAt,
            PublishedAt,
            ArchivedAt);
    }

    public string PartitionKey => Visibility;
}

public sealed record RelatedProjectDocument(string ProjectId, string Label);

public sealed record NoteCategoryDocument(string Slug, string DisplayName);

public sealed record NoteTagDocument(string Slug, string DisplayName);
