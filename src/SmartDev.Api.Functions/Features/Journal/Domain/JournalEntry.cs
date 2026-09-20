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
    private readonly List<DecisionNote> _decisions = [];
    private readonly List<BlockerNote> _blockers = [];
    private readonly List<NextAction> _nextActions = [];

    private JournalEntry(
        JournalEntryId id,
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        JournalSummary? summary,
        CompanyReference? company,
        string? workplaceContext,
        WorkOutcome? outcome,
        WorkImpact? impact,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        IEnumerable<DecisionNote> decisions,
        IEnumerable<BlockerNote> blockers,
        IEnumerable<NextAction> nextActions,
        DateOnly occurredOn,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? archivedAt) : base(id, createdAt, updatedAt)
    {
        Title = title;
        Body = body;
        EntryType = entryType;
        Status = status;
        Summary = summary;
        Company = company;
        WorkplaceContext = Guard.Optional(workplaceContext, "workplaceContext", 160);
        Outcome = outcome;
        Impact = impact;
        Confidence = confidence;
        OccurredOn = occurredOn;
        ArchivedAt = archivedAt;
        _tags.AddRange(NormalizeTags(tags));
        _collaborators.AddRange(collaborators.DistinctBy(collaborator => collaborator.Name, StringComparer.OrdinalIgnoreCase));
        _relatedArticles.AddRange(relatedArticles.DistinctBy(article => article.ArticleId));
        _decisions.AddRange(decisions.DistinctBy(decision => decision.Value, StringComparer.OrdinalIgnoreCase));
        _blockers.AddRange(blockers.DistinctBy(blocker => blocker.Value, StringComparer.OrdinalIgnoreCase));
        _nextActions.AddRange(nextActions.DistinctBy(action => action.Value, StringComparer.OrdinalIgnoreCase));
    }

    public JournalTitle Title { get; private set; }

    public JournalSummary? Summary { get; private set; }

    public MarkdownContent Body { get; private set; }

    public JournalEntryType EntryType { get; private set; }

    public JournalEntryStatus Status { get; private set; }

    public IReadOnlyCollection<ArticleTagSnapshot> Tags => _tags;

    public CompanyReference? Company { get; private set; }

    public string? WorkplaceContext { get; private set; }

    public WorkOutcome? Outcome { get; private set; }

    public WorkImpact? Impact { get; private set; }

    public IReadOnlyCollection<CollaboratorReference> Collaborators => _collaborators;

    public JournalConfidence Confidence { get; private set; }

    public IReadOnlyCollection<ArticleReference> RelatedArticles => _relatedArticles;

    public IReadOnlyCollection<DecisionNote> Decisions => _decisions;

    public IReadOnlyCollection<BlockerNote> Blockers => _blockers;

    public IReadOnlyCollection<NextAction> NextActions => _nextActions;

    public DateOnly OccurredOn { get; private set; }

    public DateTimeOffset? ArchivedAt { get; private set; }

    public string SearchableText => string.Join(
        " ",
        Title.Value,
        Summary?.Value,
        Body.Value,
        EntryType.ToString(),
        Status.ToString(),
        string.Join(" ", Tags.Select(tag => $"{tag.Slug.Value} {tag.DisplayName}")),
        Company?.Name,
        Company?.RoleTitle,
        WorkplaceContext,
        Outcome?.Value,
        Impact?.Value,
        string.Join(" ", Collaborators.Select(collaborator => collaborator.Name)),
        Confidence.ToString(),
        string.Join(" ", RelatedArticles.Select(article => article.Title)),
        string.Join(" ", Decisions.Select(decision => decision.Value)),
        string.Join(" ", Blockers.Select(blocker => blocker.Value)),
        string.Join(" ", NextActions.Select(action => action.Value)));

    public static JournalEntry Create(
        JournalEntryId id,
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        JournalSummary? summary,
        CompanyReference? company,
        string? workplaceContext,
        WorkOutcome? outcome,
        WorkImpact? impact,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        IEnumerable<DecisionNote> decisions,
        IEnumerable<BlockerNote> blockers,
        IEnumerable<NextAction> nextActions,
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
            summary,
            company,
            workplaceContext,
            outcome,
            impact,
            collaborators,
            confidence,
            relatedArticles,
            decisions,
            blockers,
            nextActions,
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
        JournalSummary? summary,
        CompanyReference? company,
        string? workplaceContext,
        WorkOutcome? outcome,
        WorkImpact? impact,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        IEnumerable<DecisionNote> decisions,
        IEnumerable<BlockerNote> blockers,
        IEnumerable<NextAction> nextActions,
        DateOnly occurredOn,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt,
        DateTimeOffset? archivedAt)
    {
        return new JournalEntry(id, title, body, entryType, status, tags, summary, company, workplaceContext, outcome, impact, collaborators, confidence, relatedArticles, decisions, blockers, nextActions, occurredOn, createdAt, updatedAt, archivedAt);
    }

    public void Update(
        JournalTitle title,
        MarkdownContent body,
        JournalEntryType entryType,
        JournalEntryStatus status,
        IEnumerable<ArticleTagSnapshot> tags,
        JournalSummary? summary,
        CompanyReference? company,
        string? workplaceContext,
        WorkOutcome? outcome,
        WorkImpact? impact,
        IEnumerable<CollaboratorReference> collaborators,
        JournalConfidence confidence,
        IEnumerable<ArticleReference> relatedArticles,
        IEnumerable<DecisionNote> decisions,
        IEnumerable<BlockerNote> blockers,
        IEnumerable<NextAction> nextActions,
        DateOnly occurredOn,
        DateTimeOffset now)
    {
        Title = title;
        Body = body;
        EntryType = entryType;
        Status = status;
        Summary = summary;
        Company = company;
        WorkplaceContext = Guard.Optional(workplaceContext, "workplaceContext", 160);
        Outcome = outcome;
        Impact = impact;
        Confidence = confidence;
        OccurredOn = occurredOn;
        ArchivedAt = status == JournalEntryStatus.Archived ? ArchivedAt ?? now : null;
        Replace(_tags, NormalizeTags(tags));
        Replace(_collaborators, collaborators.DistinctBy(collaborator => collaborator.Name, StringComparer.OrdinalIgnoreCase));
        Replace(_relatedArticles, relatedArticles.DistinctBy(article => article.ArticleId));
        Replace(_decisions, decisions.DistinctBy(decision => decision.Value, StringComparer.OrdinalIgnoreCase));
        Replace(_blockers, blockers.DistinctBy(blocker => blocker.Value, StringComparer.OrdinalIgnoreCase));
        Replace(_nextActions, nextActions.DistinctBy(action => action.Value, StringComparer.OrdinalIgnoreCase));
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
