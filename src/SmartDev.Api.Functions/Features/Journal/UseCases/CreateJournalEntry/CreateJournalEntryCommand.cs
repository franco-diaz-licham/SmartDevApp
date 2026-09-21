using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.CreateJournalEntry;

public sealed record CreateJournalEntryCommand(
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
