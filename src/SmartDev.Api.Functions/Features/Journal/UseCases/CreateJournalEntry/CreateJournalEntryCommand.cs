using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.CreateJournalEntry;

public sealed record CreateJournalEntryCommand(
    string Title,
    string BodyMarkdown,
    JournalEntryType EntryType,
    JournalEntryStatus Status,
    IReadOnlyCollection<ArticleTagSnapshot> Tags,
    string? Summary,
    CompanyReference? Company,
    string? WorkplaceContext,
    string? Outcome,
    string? Impact,
    IReadOnlyCollection<string> Collaborators,
    JournalConfidence Confidence,
    IReadOnlyCollection<ArticleReference> RelatedArticles,
    IReadOnlyCollection<string> Decisions,
    IReadOnlyCollection<string> Blockers,
    IReadOnlyCollection<string> NextActions,
    DateOnly OccurredOn);
