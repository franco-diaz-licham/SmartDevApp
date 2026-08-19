namespace SmartDev.Api.Functions.Application.UsesCases;

/// <summary>
/// Represents common query options used by paged list and search endpoints.
/// </summary>
public record BaseQuery
{
    /// <summary>
    /// Gets the maximum number of items to return.
    /// </summary>
    public int PageSize { get; init; }

    /// <summary>
    /// Gets the continuation token used to retrieve the next page of results.
    /// </summary>
    public string? ContinuationToken { get; init; }

    /// <summary>
    /// Gets the field name used to sort the result set.
    /// </summary>
    public string? SortBy { get; init; }

    /// <summary>
    /// Gets the direction used when sorting the result set.
    /// </summary>
    public SortDirection? SortDirection { get; init; }

    /// <summary>
    /// Gets the field name used for text search.
    /// </summary>
    public string? SearchBy { get; init; }

    /// <summary>
    /// Gets the text value used to search the result set.
    /// </summary>
    public string? SearchTerm { get; init; }

    /// <summary>
    /// Gets how multiple filters should be combined.
    /// </summary>
    public FilterMatch? FilterMatch { get; init; }

    /// <summary>
    /// Gets the filters applied to the result set.
    /// </summary>
    public IReadOnlyCollection<QueryFilter> Filters { get; init; } = [];

    /// <summary>
    /// Gets optional related data or projections to include with the result set.
    /// </summary>
    public string? Include { get; init; }
}

/// <summary>
/// Represents a single field-level filter in a query.
/// </summary>
/// <param name="Field">The field to filter on.</param>
/// <param name="Operator">The comparison operator to apply.</param>
/// <param name="Value">The value to compare against the field.</param>
public sealed record QueryFilter(
    string Field,
    FilterOperator Operator,
    string Value);

/// <summary>
/// Represents one page of query results.
/// </summary>
/// <typeparam name="TItem">The type of item contained in the page.</typeparam>
/// <param name="Items">The items returned for the current page.</param>
/// <param name="ContinuationToken">The token used to retrieve the next page, when more results are available.</param>
public sealed record Page<TItem>(IReadOnlyCollection<TItem> Items, string? ContinuationToken)
{
    /// <summary>
    /// Gets whether another page of results is available.
    /// </summary>
    public bool HasMore => !string.IsNullOrWhiteSpace(ContinuationToken);
}

/// <summary>
/// Defines the supported sort directions for query results.
/// </summary>
public enum SortDirection
{
    /// <summary>
    /// Sorts results from lowest to highest, oldest to newest, or A to Z.
    /// </summary>
    Asc,

    /// <summary>
    /// Sorts results from highest to lowest, newest to oldest, or Z to A.
    /// </summary>
    Desc
}

/// <summary>
/// Defines how multiple query filters should be combined.
/// </summary>
public enum FilterMatch
{
    /// <summary>
    /// Requires all filters to match.
    /// </summary>
    All,

    /// <summary>
    /// Requires at least one filter to match.
    /// </summary>
    Any
}

/// <summary>
/// Defines the supported comparison operators for query filters.
/// </summary>
public enum FilterOperator
{
    /// <summary>
    /// Matches values that are equal to the filter value.
    /// </summary>
    Equals,

    /// <summary>
    /// Matches values that are not equal to the filter value.
    /// </summary>
    NotEquals,

    /// <summary>
    /// Matches values that contain the filter value.
    /// </summary>
    Contains,

    /// <summary>
    /// Matches values that do not contain the filter value.
    /// </summary>
    NotContains,

    /// <summary>
    /// Matches values that start with the filter value.
    /// </summary>
    StartsWith,

    /// <summary>
    /// Matches values that end with the filter value.
    /// </summary>
    EndsWith,

    /// <summary>
    /// Matches values that occur before the filter value.
    /// </summary>
    Before,

    /// <summary>
    /// Matches values that occur after the filter value.
    /// </summary>
    After,

    /// <summary>
    /// Matches values that fall between two filter values.
    /// </summary>
    Between,

    /// <summary>
    /// Matches values that are greater than the filter value.
    /// </summary>
    GreaterThan,

    /// <summary>
    /// Matches values that are less than the filter value.
    /// </summary>
    LessThan,

    /// <summary>
    /// Matches values that are greater than or equal to the filter value.
    /// </summary>
    GreaterThanOrEqual,

    /// <summary>
    /// Matches values that are less than or equal to the filter value.
    /// </summary>
    LessThanOrEqual
}
