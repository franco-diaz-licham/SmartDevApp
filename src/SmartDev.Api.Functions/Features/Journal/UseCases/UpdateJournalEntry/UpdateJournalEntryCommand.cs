using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.UpdateJournalEntry;

public sealed record UpdateJournalEntryCommand(
    Guid EntryId,
    string Title,
    string BodyMarkdown,
    JournalEntryType EntryType,
    JournalEntryStatus Status,
    IReadOnlyCollection<ArticleTagSnapshot> Tags,
    CompanyReference? Company,
    IReadOnlyCollection<string> Collaborators,
    JournalConfidence Confidence,
    IReadOnlyCollection<ArticleReference> RelatedArticles,
    DateOnly OccurredOn);
