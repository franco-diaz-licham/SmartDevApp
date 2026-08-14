using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Notes;

/// <summary>
/// Represents an authored note aggregate with content, catalog metadata, and publication state.
/// </summary>
public sealed class Note : Entity<NoteId>
{
    private readonly List<NoteTagSnapshot> _tags = [];
    private readonly List<RelatedProjectReference> _relatedProjects = [];

    private Note(
        NoteId id,
        NoteTitle title,
        NoteSlug slug,
        NoteSummary summary,
        NoteCategorySnapshot category,
        MarkdownContent body,
        NoteStatus status,
        NoteVisibility visibility,
        IEnumerable<NoteTagSnapshot> tags,
        IEnumerable<RelatedProjectReference> relatedProjects,
        DateTimeOffset? updatedAt,
        DateTimeOffset? publishedAt,
        DateTimeOffset? archivedAt) : base(id)
    {
        Title = title;
        Slug = slug;
        Summary = summary;
        Category = category;
        Body = body;
        Status = status;
        Visibility = visibility;
        _tags.AddRange(NormalizeTags(tags));
        _relatedProjects.AddRange(relatedProjects.DistinctBy(project => project.ProjectId));
        PublishedAt = publishedAt;
        ArchivedAt = archivedAt;
        if (updatedAt is not null) Touch(updatedAt.Value);
    }

    private Note(
        NoteId id,
        NoteTitle title,
        NoteSlug slug,
        NoteSummary summary,
        NoteCategorySnapshot category,
        MarkdownContent body,
        NoteStatus status,
        NoteVisibility visibility,
        IEnumerable<NoteTagSnapshot> tags,
        IEnumerable<RelatedProjectReference> relatedProjects,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? publishedAt,
        DateTimeOffset? archivedAt) : base(id, createdAt, updatedAt)
    {
        Title = title;
        Slug = slug;
        Summary = summary;
        Category = category;
        Body = body;
        Status = status;
        Visibility = visibility;
        _tags.AddRange(NormalizeTags(tags));
        _relatedProjects.AddRange(relatedProjects.DistinctBy(project => project.ProjectId));
        PublishedAt = publishedAt;
        ArchivedAt = archivedAt;
    }

    /// <summary>
    /// Gets the human-readable note title.
    /// </summary>
    public NoteTitle Title { get; private set; }

    /// <summary>
    /// Gets the URL-safe slug used to route to the note.
    /// </summary>
    public NoteSlug Slug { get; private set; }

    /// <summary>
    /// Gets the short note summary used in lists and search results.
    /// </summary>
    public NoteSummary Summary { get; private set; }

    /// <summary>
    /// Gets the broad category assigned to the note.
    /// </summary>
    public NoteCategorySnapshot Category { get; private set; }

    /// <summary>
    /// Gets the Markdown body content for the note.
    /// </summary>
    public MarkdownContent Body { get; private set; }

    /// <summary>
    /// Gets the note publication lifecycle status.
    /// </summary>
    public NoteStatus Status { get; private set; }

    /// <summary>
    /// Gets whether the note is public or private.
    /// </summary>
    public NoteVisibility Visibility { get; private set; }

    /// <summary>
    /// Gets the resolved tag snapshots attached to the note.
    /// </summary>
    public IReadOnlyCollection<NoteTagSnapshot> Tags => _tags;

    /// <summary>
    /// Gets the portfolio projects related to the note.
    /// </summary>
    public IReadOnlyCollection<RelatedProjectReference> RelatedProjects => _relatedProjects;

    /// <summary>
    /// Gets when the note was published, when it has been published.
    /// </summary>
    public DateTimeOffset? PublishedAt { get; private set; }

    /// <summary>
    /// Gets when the note was archived, when it has been archived.
    /// </summary>
    public DateTimeOffset? ArchivedAt { get; private set; }

    /// <summary>
    /// Gets the combined note text used for simple search matching.
    /// </summary>
    public string SearchableText => string.Join(
        " ",
        Title.Value,
        Summary.Value,
        Category.Slug.Value,
        Category.DisplayName,
        string.Join(" ", Tags.Select(tag => $"{tag.Slug.Value} {tag.DisplayName}")),
        string.Join(" ", RelatedProjects.Select(project => project.Label)),
        Body.Value);

    /// <summary>
    /// Creates a private draft note and raises a creation event.
    /// </summary>
    public static Note CreateDraft(
        NoteId id,
        NoteTitle title,
        NoteSlug slug,
        NoteSummary summary,
        NoteCategorySnapshot category,
        MarkdownContent body,
        IEnumerable<NoteTagSnapshot> tags,
        IEnumerable<RelatedProjectReference>? relatedProjects,
        DateTimeOffset? now = null)
    {
        var occurredAt = now ?? DateTimeOffset.UtcNow;
        var note = new Note(
            id,
            title,
            slug,
            summary,
            category,
            body,
            NoteStatus.Draft,
            NoteVisibility.Private,
            tags,
            relatedProjects ?? [],
            updatedAt: null,
            publishedAt: null,
            archivedAt: null);

        note.RaiseDomainEvent(new NoteCreatedEvent(id, occurredAt));
        return note;
    }

    /// <summary>
    /// Rehydrates a note aggregate from persisted state without raising domain events.
    /// </summary>
    public static Note Hydrate(
        NoteId id,
        NoteTitle title,
        NoteSlug slug,
        NoteSummary summary,
        NoteCategorySnapshot category,
        MarkdownContent body,
        NoteStatus status,
        NoteVisibility visibility,
        IEnumerable<NoteTagSnapshot> tags,
        IEnumerable<RelatedProjectReference> relatedProjects,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? publishedAt,
        DateTimeOffset? archivedAt)
    {
        return new Note(id, title, slug, summary, category, body, status, visibility, tags, relatedProjects, createdAt, updatedAt, publishedAt, archivedAt);
    }

    /// <summary>
    /// Changes the note title and route slug.
    /// </summary>
    public void Rename(NoteTitle title, NoteSlug slug, DateTimeOffset now)
    {
        Title = title;
        Slug = slug;
        MarkUpdated(now);
    }

    /// <summary>
    /// Replaces the short summary used in note previews.
    /// </summary>
    public void UpdateSummary(NoteSummary summary, DateTimeOffset now)
    {
        Summary = summary;
        MarkUpdated(now);
    }

    /// <summary>
    /// Replaces the Markdown body content.
    /// </summary>
    public void UpdateBody(MarkdownContent body, DateTimeOffset now)
    {
        Body = body;
        MarkUpdated(now);
    }

    /// <summary>
    /// Changes the note category snapshot.
    /// </summary>
    public void ChangeCategory(NoteCategorySnapshot category, DateTimeOffset now)
    {
        Category = category;
        MarkUpdated(now);
    }

    /// <summary>
    /// Replaces the note tag snapshots with a normalized non-empty set.
    /// </summary>
    public void ReplaceTags(IEnumerable<NoteTagSnapshot> tags, DateTimeOffset now)
    {
        _tags.Clear();
        _tags.AddRange(NormalizeTags(tags));
        MarkUpdated(now);
    }

    /// <summary>
    /// Links a related portfolio project when it is not already linked.
    /// </summary>
    public void LinkProject(RelatedProjectReference project, DateTimeOffset now)
    {
        if (_relatedProjects.Any(existing => string.Equals(existing.ProjectId, project.ProjectId, StringComparison.OrdinalIgnoreCase))) return;
        _relatedProjects.Add(project);
        MarkUpdated(now);
    }

    /// <summary>
    /// Removes a related portfolio project link.
    /// </summary>
    public void UnlinkProject(RelatedProjectReference project, DateTimeOffset now)
    {
        _relatedProjects.RemoveAll(existing => string.Equals(existing.ProjectId, project.ProjectId, StringComparison.OrdinalIgnoreCase));
        MarkUpdated(now);
    }

    /// <summary>
    /// Publishes the note and makes it publicly visible.
    /// </summary>
    public void Publish(DateTimeOffset now)
    {
        Status = NoteStatus.Published;
        Visibility = NoteVisibility.Public;
        PublishedAt ??= now;
        ArchivedAt = null;
        MarkUpdated(now);
        RaiseDomainEvent(new NotePublishedEvent(Id, now));
    }

    /// <summary>
    /// Changes the note lifecycle state and visibility together.
    /// </summary>
    public void ChangePublication(NoteStatus status, NoteVisibility visibility, DateTimeOffset now)
    {
        if (Status == status && Visibility == visibility) return;

        var previousStatus = Status;
        Status = status;
        Visibility = visibility;

        if (Status == NoteStatus.Published && PublishedAt is null) {
            PublishedAt = now;
        }

        if (Status == NoteStatus.Archived) {
            ArchivedAt ??= now;
        } else {
            ArchivedAt = null;
        }

        if (Status == NoteStatus.Draft) {
            PublishedAt = null;
        }

        MarkUpdated(now);

        if (previousStatus != NoteStatus.Published && Status == NoteStatus.Published) {
            RaiseDomainEvent(new NotePublishedEvent(Id, now));
        }

        if (previousStatus != NoteStatus.Archived && Status == NoteStatus.Archived) {
            RaiseDomainEvent(new NoteArchivedEvent(Id, now));
        }
    }

    /// <summary>
    /// Restricts the note from public reader experiences.
    /// </summary>
    public void MakePrivate(DateTimeOffset now)
    {
        Visibility = NoteVisibility.Private;
        MarkUpdated(now);
    }

    /// <summary>
    /// Allows the note to appear in public reader experiences.
    /// </summary>
    public void MakePublic(DateTimeOffset now)
    {
        Visibility = NoteVisibility.Public;
        MarkUpdated(now);
    }

    /// <summary>
    /// Archives the note and raises an archival event.
    /// </summary>
    public void Archive(DateTimeOffset now)
    {
        Status = NoteStatus.Archived;
        ArchivedAt = now;
        MarkUpdated(now);
        RaiseDomainEvent(new NoteArchivedEvent(Id, now));
    }

    private void MarkUpdated(DateTimeOffset now)
    {
        Touch(now);
        RaiseDomainEvent(new NoteUpdatedEvent(Id, now));
    }

    private static List<NoteTagSnapshot> NormalizeTags(IEnumerable<NoteTagSnapshot> tags)
    {
        var normalized = tags.DistinctBy(tag => tag.Slug.Value).ToList();
        if (normalized.Count == 0) throw new ArgumentException("tags must contain at least one item.", "tags");
        return normalized;
    }
}
