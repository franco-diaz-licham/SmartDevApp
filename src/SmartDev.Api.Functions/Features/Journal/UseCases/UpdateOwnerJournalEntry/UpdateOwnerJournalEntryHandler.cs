using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Contracts;
using SmartDev.Api.Functions.Features.Journal.Domain;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.UpdateOwnerJournalEntry;

public sealed class UpdateOwnerJournalEntryHandler(IJournalRepository journalRepository)
{
    public async Task<Result<JournalSaveResult>> HandleAsync(UpdateOwnerJournalEntryCommand command, CancellationToken cancellationToken)
    {
        try {
            var entry = await journalRepository.GetByIdAsync(JournalEntryId.From(command.EntryId), cancellationToken);
            if (entry is null) return Result<JournalSaveResult>.Fail("Journal entry was not found.", ResultTypeEnum.NotFound);

            entry.Update(
                JournalTitle.Create(command.Title),
                MarkdownContent.Create(command.BodyMarkdown),
                command.EntryType,
                command.Status,
                command.Tags,
                JournalSummary.CreateOptional(command.Summary),
                command.Company,
                command.WorkplaceContext,
                WorkOutcome.CreateOptional(command.Outcome),
                WorkImpact.CreateOptional(command.Impact),
                command.Collaborators.Select(CollaboratorReference.Create),
                command.Confidence,
                command.RelatedArticles,
                command.Decisions.Select(DecisionNote.Create),
                command.Blockers.Select(BlockerNote.Create),
                command.NextActions.Select(NextAction.Create),
                command.OccurredOn,
                DateTimeOffset.UtcNow);

            await journalRepository.SaveAsync(entry, cancellationToken);
            return Result<JournalSaveResult>.Success(new JournalSaveResult(entry.Id.Value));
        } catch (ArgumentException exception) {
            return Result<JournalSaveResult>.Fail(exception.Message, ResultTypeEnum.Invalid);
        }
    }
}
