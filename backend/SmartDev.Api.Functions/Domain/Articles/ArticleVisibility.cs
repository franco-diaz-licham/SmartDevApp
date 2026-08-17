namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Describes whether an article can be shown outside administrative experiences.
/// </summary>
public enum ArticleVisibility
{
    /// <summary>
    /// The article is restricted to administrative or authoring flows.
    /// </summary>
    Private,

    /// <summary>
    /// The article may be shown in public reader experiences.
    /// </summary>
    Public
}
