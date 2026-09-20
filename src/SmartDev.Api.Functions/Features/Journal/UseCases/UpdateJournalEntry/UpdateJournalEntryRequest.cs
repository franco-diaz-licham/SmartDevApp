using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Journal.Domain;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.UpdateJournalEntry;

public sealed record UpdateJournalEntryRequest(
    string Title,
    string BodyMarkdown,
    string? EntryType,
    string? Status,
    IReadOnlyCollection<JournalTagRequest>? Tags,
    JournalCompanyRequest? Company,
    string? WorkplaceContext,
    string? Outcome,
    string? Impact,
    IReadOnlyCollection<string>? Collaborators,
    string? Confidence,
    IReadOnlyCollection<JournalRelatedArticleRequest>? RelatedArticles,
    IReadOnlyCollection<string>? Decisions,
    IReadOnlyCollection<string>? Blockers,
    IReadOnlyCollection<string>? NextActions,
    string? OccurredOn)
{
    public Result<UpdateJournalEntryCommand> ToCommandResult(Guid entryId)
    {
        return JournalEditMapping.BindCommand(() => new UpdateJournalEntryCommand(
            entryId,
            Title,
            BodyMarkdown,
            JournalEditMapping.BindEntryType(EntryType),
            JournalEditMapping.BindStatus(Status),
            JournalEditMapping.BindOptionalCollection(Tags, tag => tag.ToInput()),
            CompanyReference.CreateOptional(Company?.Name, Company?.RoleTitle),
            WorkplaceContext,
            Outcome,
            Impact,
            Collaborators ?? [],
            JournalEditMapping.BindConfidence(Confidence),
            JournalEditMapping.BindOptionalCollection(RelatedArticles, article => article.ToInput()),
            Decisions ?? [],
            Blockers ?? [],
            NextActions ?? [],
            JournalEditMapping.BindOccurredOn(OccurredOn)));
    }
}
