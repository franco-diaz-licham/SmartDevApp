using SmartDev.Api.Functions.Common.Domain;
using SmartDev.Api.Functions.Features.Articles.Domain;

namespace SmartDev.Api.Functions.Features.Journal.Domain;

/// <summary>
/// Private development journal entry.
/// </summary>
public sealed class JournalEntry : Entity<JournalEntryId>
{
    private readonly List<ArticleTagSnapshot> _tags = [];
    private readonly List<CollaboratorReference> _collaborators = [];
    private readonly List<ArticleReference> _relatedArticles = [];

    private JournalEntry(
        JournalEntryId id,
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        CompanyReference? company,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        DateOnly occurredOn,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? archivedAt) : base(id, createdAt, updatedAt)
    {
        Title = title;
        Body = body;
        EntryType = entryType;
        Status = status;
        Company = company;
        Confidence = confidence;
        OccurredOn = occurredOn;
        ArchivedAt = archivedAt;
        _tags.AddRange(NormalizeTags(tags));
        _collaborators.AddRange(collaborators.DistinctBy(collaborator => collaborator.Name, StringComparer.OrdinalIgnoreCase));
        _relatedArticles.AddRange(relatedArticles.DistinctBy(article => article.ArticleId));
    }

    public JournalTitle Title { get; private set; }

    public MarkdownContent Body { get; private set; }

    public JournalEntryType EntryType { get; private set; }

    public JournalEntryStatus Status { get; private set; }

    public IReadOnlyCollection<ArticleTagSnapshot> Tags => _tags;

    public CompanyReference? Company { get; private set; }

    public IReadOnlyCollection<CollaboratorReference> Collaborators => _collaborators;

    public JournalConfidence Confidence { get; private set; }

    public IReadOnlyCollection<ArticleReference> RelatedArticles => _relatedArticles;

    public DateOnly OccurredOn { get; private set; }

    public DateTimeOffset? ArchivedAt { get; private set; }

    public string SearchableText => string.Join(
        " ",
        Title.Value,
        Body.Value,
        EntryType.ToString(),
        Status.ToString(),
        string.Join(" ", Tags.Select(tag => $"{tag.Slug.Value} {tag.DisplayName}")),
        Company?.Name,
        Company?.RoleTitle,
        string.Join(" ", Collaborators.Select(collaborator => collaborator.Name)),
        Confidence.ToString(),
        string.Join(" ", RelatedArticles.Select(article => article.Title)));

    public static JournalEntry Create(
        JournalEntryId id,
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        CompanyReference? company,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        DateOnly occurredOn,
        DateTimeOffset? now = null)
    {
        return new JournalEntry(
            id,
            title,
            body,
            entryType,
            status,
            tags,
            company,
            collaborators,
            confidence,
            relatedArticles,
            occurredOn,
            now ?? DateTimeOffset.UtcNow,
            updatedAt: null,
            archivedAt: status == JournalEntryStatus.Archived ? now ?? DateTimeOffset.UtcNow : null);
    }

    public static JournalEntry Hydrate(
        JournalEntryId id,
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        CompanyReference? company,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        DateOnly occurredOn,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? archivedAt)
    {
        return new JournalEntry(id, title, body, entryType, status, tags, company, collaborators, confidence, relatedArticles, occurredOn, createdAt, updatedAt, archivedAt);
    }

    public void Update(
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        CompanyReference? company,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        DateOnly occurredOn,
        DateTimeOffset now)
    {
        Title = title;
        Body = body;
        EntryType = entryType;
        Status = status;
        Company = company;
        Confidence = confidence;
        OccurredOn = occurredOn;
        ArchivedAt = status == JournalEntryStatus.Archived ? ArchivedAt ?? now : null;
        Replace(_tags, NormalizeTags(tags));
        Replace(_collaborators, collaborators.DistinctBy(collaborator => collaborator.Name, StringComparer.OrdinalIgnoreCase));
        Replace(_relatedArticles, relatedArticles.DistinctBy(article => article.ArticleId));
        Touch(now);
    }

    private static List<ArticleTagSnapshot> NormalizeTags(IEnumerable<ArticleTagSnapshot> tags)
    {
        return tags.DistinctBy(tag => tag.Slug.Value, StringComparer.OrdinalIgnoreCase).ToList();
    }

    private static void Replace<TValue>(List<TValue> target, IEnumerable<TValue> values)
    {
        target.Clear();
        target.AddRange(values);
    }
}
