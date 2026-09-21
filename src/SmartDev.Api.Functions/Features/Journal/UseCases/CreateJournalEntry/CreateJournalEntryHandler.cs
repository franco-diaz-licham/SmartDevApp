using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Contracts;
using SmartDev.Api.Functions.Features.Journal.Domain;
using SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.CreateJournalEntry;

public sealed class CreateJournalEntryHandler(IJournalRepository journalRepository)
{
    public async Task<Result<JournalSaveResult>> HandleAsync(CreateJournalEntryCommand command, CancellationToken cancellationToken)
    {
        try {
            var entry = JournalEntry.Create(
                JournalEntryId.New(),
                JournalTitle.Create(command.Title),
                MarkdownContent.Create(command.BodyMarkdown),
                command.EntryType,
                command.Status,
                command.Tags,
                command.Company,
                command.Collaborators.Select(CollaboratorReference.Create),
                command.Confidence,
                command.RelatedJournalEntries,
                command.OccurredOn);

            await journalRepository.AddAsync(entry, cancellationToken);
            return Result<JournalSaveResult>.Success(new JournalSaveResult(entry.Id.Value), ResultTypeEnum.Created);
        } catch (ArgumentException exception) {
            return Result<JournalSaveResult>.Fail(exception.Message, ResultTypeEnum.Invalid);
        } catch (InvalidOperationException exception) {
            return Result<JournalSaveResult>.Fail(exception.Message, ResultTypeEnum.Conflict);
        }
    }
}
