namespace SmartDev.Api.Functions.Application.UsesCases;

public record BaseQuery
{
    public int PageSize { get; init; }

    public string? ContinuationToken { get; init; }

    public string? SortBy { get; init; }

    public SortDirection? SortDirection { get; init; }

    public string? SearchBy { get; init; }

    public string? SearchTerm { get; init; }

    public FilterMatch? FilterMatch { get; init; }

    public IReadOnlyCollection<QueryFilter> Filters { get; init; } = [];

    public string? Include { get; init; }
}

public sealed record QueryFilter(
    string Field,
    FilterOperator Operator,
    string Value);

public sealed record CursorPage<TItem>(IReadOnlyCollection<TItem> Items, string? ContinuationToken)
{
    public bool HasMore => !string.IsNullOrWhiteSpace(ContinuationToken);
}

public enum SortDirection
{
    Asc,
    Desc
}

public enum FilterMatch
{
    All,
    Any
}

public enum FilterOperator
{
    Equals,
    NotEquals,
    Contains,
    NotContains,
    StartsWith,
    EndsWith,
    Before,
    After,
    Between,
    GreaterThan,
    LessThan,
    GreaterThanOrEqual,
    LessThanOrEqual
}
