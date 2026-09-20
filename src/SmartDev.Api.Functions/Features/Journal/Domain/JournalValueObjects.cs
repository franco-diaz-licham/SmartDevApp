using SmartDev.Api.Functions.Common.Domain;
using SmartDev.Api.Functions.Features.Articles.Domain;

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
/// Optional short summary for list previews and future review pages.
/// </summary>
public sealed record JournalSummary
{
    private const int MaxLength = 500;

    private JournalSummary(string value) => Value = value;

    public string Value { get; }

    public static JournalSummary? CreateOptional(string? value)
    {
        var summary = Guard.Optional(value, "summary", MaxLength);
        return summary is null ? null : new JournalSummary(summary);
    }
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
/// Optional outcome text for what changed.
/// </summary>
public sealed record WorkOutcome
{
    private const int MaxLength = 160;

    private WorkOutcome(string value) => Value = value;

    public string Value { get; }

    public static WorkOutcome? CreateOptional(string? value)
    {
        var outcome = Guard.Optional(value, "outcome", MaxLength);
        return outcome is null ? null : new WorkOutcome(outcome);
    }
}

/// <summary>
/// Optional impact text for why the work mattered.
/// </summary>
public sealed record WorkImpact
{
    private const int MaxLength = 500;

    private WorkImpact(string value) => Value = value;

    public string Value { get; }

    public static WorkImpact? CreateOptional(string? value)
    {
        var impact = Guard.Optional(value, "impact", MaxLength);
        return impact is null ? null : new WorkImpact(impact);
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
/// Optional article link copied by stable article id.
/// </summary>
public sealed record ArticleReference
{
    private const int MaxTitleLength = 160;

    private ArticleReference(ArticleId articleId, string title)
    {
        ArticleId = articleId;
        Title = title;
    }

    public ArticleId ArticleId { get; }

    public string Title { get; }

    public static ArticleReference Create(Guid articleId, string title) => new(ArticleId.From(articleId), Guard.Required(title, "articleTitle", MaxTitleLength));
}

/// <summary>
/// Optional decision note extracted from a journal entry.
/// </summary>
public sealed record DecisionNote
{
    private const int MaxLength = 500;

    private DecisionNote(string value) => Value = value;

    public string Value { get; }

    public static DecisionNote Create(string value) => new(Guard.Required(value, "decision", MaxLength));
}

/// <summary>
/// Optional blocker note extracted from a journal entry.
/// </summary>
public sealed record BlockerNote
{
    private const int MaxLength = 500;

    private BlockerNote(string value) => Value = value;

    public string Value { get; }

    public static BlockerNote Create(string value) => new(Guard.Required(value, "blocker", MaxLength));
}

/// <summary>
/// Optional next action extracted from a journal entry.
/// </summary>
public sealed record NextAction
{
    private const int MaxLength = 500;

    private NextAction(string value) => Value = value;

    public string Value { get; }

    public static NextAction Create(string value) => new(Guard.Required(value, "nextAction", MaxLength));
}
