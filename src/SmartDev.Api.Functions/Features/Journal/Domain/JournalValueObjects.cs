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
