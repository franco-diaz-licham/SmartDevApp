using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

public sealed record JournalCompanyRequest(string? Name, string? RoleTitle);

public sealed record JournalTagRequest(string Slug, string DisplayName)
{
    public ArticleTagSnapshot ToInput() => ArticleTagSnapshot.Create(ArticleTagSlug.Create(Slug), DisplayName);
}

public sealed record JournalRelatedJournalEntryRequest(Guid EntryId, string Title)
{
    public JournalEntryReference ToInput() => JournalEntryReference.Create(EntryId, Title);
}

internal static class JournalEditMapping
{
    public static Result<TCommand> BindCommand<TCommand>(Func<TCommand> bind)
    {
        try {
            return Result<TCommand>.Success(bind());
        } catch (ArgumentException exception) {
            return Result<TCommand>.Fail(exception.Message, ResultTypeEnum.Invalid);
        }
    }

    public static JournalEntryType BindEntryType(string? entryType)
    {
        if (string.IsNullOrWhiteSpace(entryType)) return JournalEntryType.Note;
        if (Enum.TryParse<JournalEntryType>(entryType, ignoreCase: true, out var parsed) && Enum.IsDefined(parsed)) return parsed;
        throw new ArgumentException("entryType is invalid.", "entryType");
    }

    public static JournalEntryStatus BindStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return JournalEntryStatus.Active;
        if (Enum.TryParse<JournalEntryStatus>(status, ignoreCase: true, out var parsed) && Enum.IsDefined(parsed)) return parsed;
        throw new ArgumentException("status is invalid.", "status");
    }

    public static JournalConfidence BindConfidence(string? confidence)
    {
        if (string.IsNullOrWhiteSpace(confidence)) return JournalConfidence.Confirmed;
        if (Enum.TryParse<JournalConfidence>(confidence, ignoreCase: true, out var parsed) && Enum.IsDefined(parsed)) return parsed;
        throw new ArgumentException("confidence is invalid.", "confidence");
    }

    public static DateOnly BindOccurredOn(string? occurredOn)
    {
        if (string.IsNullOrWhiteSpace(occurredOn)) return DateOnly.FromDateTime(DateTimeOffset.UtcNow.UtcDateTime);
        if (DateOnly.TryParse(occurredOn, out var parsed)) return parsed;
        throw new ArgumentException("occurredOn must be a valid date.", "occurredOn");
    }

    public static IReadOnlyCollection<TInput> BindOptionalCollection<TRequest, TInput>(IEnumerable<TRequest>? requests, Func<TRequest, TInput> map)
    {
        return (requests ?? []).Select(map).ToArray();
    }
}
