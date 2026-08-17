namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Describes the publication lifecycle state of an article.
/// </summary>
public enum ArticleStatus
{
    /// <summary>
    /// The article is editable and not intended for public presentation.
    /// </summary>
    Draft,

    /// <summary>
    /// The article is published and may be visible to readers.
    /// </summary>
    Published,

    /// <summary>
    /// The article has been retired from the active article catalog.
    /// </summary>
    Archived
}
