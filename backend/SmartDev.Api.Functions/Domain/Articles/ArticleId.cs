namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Identifies an article aggregate with a stable generated identifier.
/// </summary>
/// <param name="Value">The underlying article identifier.</param>
public readonly record struct ArticleId(Guid Value)
{
    /// <summary>
    /// Creates a new article identifier.
    /// </summary>
    public static ArticleId New() => new(Guid.NewGuid());

    /// <summary>
    /// Creates an article identifier from a persisted GUID value.
    /// </summary>
    public static ArticleId From(Guid value)
    {
        if (value == Guid.Empty) throw new ArgumentException("Article id is required.", nameof(value));
        return new ArticleId(value);
    }
}
