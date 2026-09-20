using Newtonsoft.Json;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Articles.Infrastructure.Persistence;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.Infrastructure.Persistence;

public sealed class JournalEntryDocument
{
    public const string ContainerName = "journal";
    public const string DocumentType = "journalEntry";
    public const string PartitionKeyPath = "/partitionKey";
    public const string PartitionKey = "journal";

    [JsonProperty("id")]
    public string Id { get; init; } = string.Empty;

    public string Type { get; init; } = DocumentType;

    public string Title { get; init; } = string.Empty;

    public string? Summary { get; init; }

    public string BodyMarkdown { get; init; } = string.Empty;

    public string EntryType { get; init; } = JournalEntryType.Note.ToString();

    public string Status { get; init; } = JournalEntryStatus.Active.ToString();

    public IReadOnlyCollection<ArticleTagDocument> Tags { get; init; } = [];

    public CompanyDocument? Company { get; init; }

    public string? WorkplaceContext { get; init; }

    public string? Outcome { get; init; }

    public string? Impact { get; init; }

    public IReadOnlyCollection<CollaboratorDocument> Collaborators { get; init; } = [];

    public string Confidence { get; init; } = JournalConfidence.Confirmed.ToString();

    public IReadOnlyCollection<RelatedArticleDocument> RelatedArticles { get; init; } = [];

    public IReadOnlyCollection<string> Decisions { get; init; } = [];

    public IReadOnlyCollection<string> Blockers { get; init; } = [];

    public IReadOnlyCollection<string> NextActions { get; init; } = [];

    public string OccurredOn { get; init; } = string.Empty;

    public DateTimeOffset CreatedAt { get; init; }

    public DateTimeOffset? UpdatedAt { get; init; }

    public DateTimeOffset? ArchivedAt { get; init; }

    [JsonProperty("partitionKey")]
    public string PartitionKeyValue { get; init; } = PartitionKey;

    public static JournalEntryDocument FromDomain(JournalEntry entry)
    {
        return new JournalEntryDocument {
            Id = entry.Id.Value.ToString("D"),
            Title = entry.Title.Value,
            Summary = entry.Summary?.Value,
            BodyMarkdown = entry.Body.Value,
            EntryType = entry.EntryType.ToString(),
            Status = entry.Status.ToString(),
            Tags = entry.Tags.Select(tag => new ArticleTagDocument(tag.Slug.Value, tag.DisplayName)).ToArray(),
            Company = entry.Company is null ? null : new CompanyDocument(entry.Company.Name, entry.Company.RoleTitle),
            WorkplaceContext = entry.WorkplaceContext,
            Outcome = entry.Outcome?.Value,
            Impact = entry.Impact?.Value,
            Collaborators = entry.Collaborators.Select(collaborator => new CollaboratorDocument(collaborator.Name)).ToArray(),
            Confidence = entry.Confidence.ToString(),
            RelatedArticles = entry.RelatedArticles.Select(article => new RelatedArticleDocument(article.ArticleId.Value.ToString("D"), article.Title)).ToArray(),
            Decisions = entry.Decisions.Select(decision => decision.Value).ToArray(),
            Blockers = entry.Blockers.Select(blocker => blocker.Value).ToArray(),
            NextActions = entry.NextActions.Select(action => action.Value).ToArray(),
            OccurredOn = entry.OccurredOn.ToString("yyyy-MM-dd"),
            CreatedAt = entry.CreatedAt,
            UpdatedAt = entry.UpdatedAt,
            ArchivedAt = entry.ArchivedAt
        };
    }

    public JournalEntry ToDomain()
    {
        return JournalEntry.Hydrate(
            JournalEntryId.From(Guid.Parse(Id)),
            JournalTitle.Create(Title),
            MarkdownContent.Create(BodyMarkdown),
            ResolveEnum(EntryType, JournalEntryType.Note),
            ResolveEnum(Status, JournalEntryStatus.Active),
            Tags.Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag.Slug), tag.DisplayName)),
            JournalSummary.CreateOptional(Summary),
            CompanyReference.CreateOptional(Company?.Name, Company?.RoleTitle),
            WorkplaceContext,
            WorkOutcome.CreateOptional(Outcome),
            WorkImpact.CreateOptional(Impact),
            Collaborators.Select(collaborator => CollaboratorReference.Create(collaborator.Name)),
            ResolveEnum(Confidence, JournalConfidence.Confirmed),
            RelatedArticles.Select(article => ArticleReference.Create(Guid.Parse(article.ArticleId), article.Title)),
            Decisions.Select(DecisionNote.Create),
            Blockers.Select(BlockerNote.Create),
            NextActions.Select(NextAction.Create),
            DateOnly.Parse(OccurredOn),
            CreatedAt,
            UpdatedAt,
            ArchivedAt);
    }

    private static TEnum ResolveEnum<TEnum>(string? value, TEnum fallback)
        where TEnum : struct, Enum
    {
        return Enum.TryParse<TEnum>(value, ignoreCase: true, out var parsed) && Enum.IsDefined(parsed)
            ? parsed
            : fallback;
    }
}

public sealed record CompanyDocument(string Name, string? RoleTitle);

public sealed record CollaboratorDocument(string Name);

public sealed record RelatedArticleDocument(string ArticleId, string Title);
