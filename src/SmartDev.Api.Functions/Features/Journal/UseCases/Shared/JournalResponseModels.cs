using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Api.Functions.Features.Journal.UseCases.Shared;

public sealed record JournalCompanyResponse(string Name, string? RoleTitle);

public sealed record JournalTagResponse(string Slug, string DisplayName);

public sealed record JournalRelatedJournalEntryResponse(string EntryId, string Title);

public sealed record JournalListItem(
    string Id,
    string Title,
    string EntryType,
    string Status,
    IReadOnlyCollection<JournalTagResponse> Tags,
    JournalCompanyResponse? Company,
    string Confidence,
    string OccurredOn,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt)
{
    public static JournalListItem FromDomain(JournalEntry entry)
    {
        return new JournalListItem(
            entry.Id.Value.ToString("D"),
            entry.Title.Value,
            entry.EntryType.ToString(),
            entry.Status.ToString(),
            entry.Tags.Select(tag => new JournalTagResponse(tag.Slug.Value, tag.DisplayName)).ToArray(),
            entry.Company is null ? null : new JournalCompanyResponse(entry.Company.Name, entry.Company.RoleTitle),
            entry.Confidence.ToString(),
            entry.OccurredOn.ToString("yyyy-MM-dd"),
            entry.CreatedAt,
            entry.UpdatedAt);
    }
}

public sealed record JournalDetail(
    string Id,
    string Title,
    string BodyMarkdown,
    string EntryType,
    string Status,
    IReadOnlyCollection<JournalTagResponse> Tags,
    JournalCompanyResponse? Company,
    IReadOnlyCollection<string> Collaborators,
    string Confidence,
    IReadOnlyCollection<JournalRelatedJournalEntryResponse> RelatedJournalEntries,
    string OccurredOn,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    DateTimeOffset? ArchivedAt)
{
    public static JournalDetail FromDomain(JournalEntry entry)
    {
        return new JournalDetail(
            entry.Id.Value.ToString("D"),
            entry.Title.Value,
            entry.Body.Value,
            entry.EntryType.ToString(),
            entry.Status.ToString(),
            entry.Tags.Select(tag => new JournalTagResponse(tag.Slug.Value, tag.DisplayName)).ToArray(),
            entry.Company is null ? null : new JournalCompanyResponse(entry.Company.Name, entry.Company.RoleTitle),
            entry.Collaborators.Select(collaborator => collaborator.Name).ToArray(),
            entry.Confidence.ToString(),
            entry.RelatedJournalEntries.Select(article => new JournalRelatedJournalEntryResponse(article.EntryId.Value.ToString("D"), article.Title)).ToArray(),
            entry.OccurredOn.ToString("yyyy-MM-dd"),
            entry.CreatedAt,
            entry.UpdatedAt,
            entry.ArchivedAt);
    }
}

public sealed record JournalSaveResult(Guid EntryId);
