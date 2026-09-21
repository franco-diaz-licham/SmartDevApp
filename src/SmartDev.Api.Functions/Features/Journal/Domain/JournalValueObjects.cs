using SmartDev.Api.Functions.Common.Domain;

namespace SmartDev.Api.Functions.Features.Journal.Domain;

/// <summary>
/// Human-readable title for a journal entry.
/// </summary>
public sealed record JournalTitle
{
    private const int MaxLength = 160;

    private JournalTitle(string value) => Value = value;

    public string Value { get; }

    public static JournalTitle Create(string value) => new(Guard.Required(value, "title", MaxLength));
}

/// <summary>
/// Optional company context used to group entries over a long career.
/// </summary>
public sealed record CompanyReference
{
    private const int MaxNameLength = 160;
    private const int MaxRoleTitleLength = 160;

    private CompanyReference(string name, string? roleTitle)
    {
        Name = name;
        RoleTitle = roleTitle;
    }

    public string Name { get; }

    public string? RoleTitle { get; }

    public static CompanyReference? CreateOptional(string? name, string? roleTitle)
    {
        var companyName = Guard.Optional(name, "companyName", MaxNameLength);
        if (companyName is null) return null;
        return new CompanyReference(companyName, Guard.Optional(roleTitle, "companyRoleTitle", MaxRoleTitleLength));
    }
}

/// <summary>
/// Optional person involved in the work.
/// </summary>
public sealed record CollaboratorReference
{
    private const int MaxNameLength = 160;

    private CollaboratorReference(string name) => Name = name;

    public string Name { get; }

    public static CollaboratorReference Create(string name) => new(Guard.Required(name, "collaborator", MaxNameLength));
}

/// <summary>
/// Optional journal entry link copied by stable journal entry id.
/// </summary>
public sealed record JournalEntryReference
{
    private const int MaxTitleLength = 160;

    private JournalEntryReference(JournalEntryId entryId, string title)
    {
        EntryId = entryId;
        Title = title;
    }

    public JournalEntryId EntryId { get; }

    public string Title { get; }

    public static JournalEntryReference Create(Guid entryId, string title) => new(JournalEntryId.From(entryId), Guard.Required(title, "journalEntryTitle", MaxTitleLength));
}
