using System.Net;
using System.Web;
using Microsoft.Azure.Functions.Worker.Http;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Functions;

internal static class HttpRequestDataExtensions
{
    private const char FilterSeparator = ':';
    private const string PageSizeQueryKey = "pageSize";
    private const string ContinuationTokenQueryKey = "continuationToken";
    private const string SortByQueryKey = "sortBy";
    private const string SortDirectionQueryKey = "sortDirection";
    private const string SearchByQueryKey = "searchBy";
    private const string SearchTermQueryKey = "searchTerm";
    private const string FilterMatchQueryKey = "filterMatch";
    private const string FiltersQueryKey = "filters";
    private const string IncludeQueryKey = "include";

    public static BaseQuery BindBaseQuery(this HttpRequestData request, int defaultPageSize = 20, int maxPageSize = 100)
    {
        var query = HttpUtility.ParseQueryString(request.Url.Query);
        var pageSize = ParsePageSize(query.Get(PageSizeQueryKey), defaultPageSize, maxPageSize);
        return new BaseQuery {
            PageSize = pageSize,
            ContinuationToken = NullIfWhiteSpace(query.Get(ContinuationTokenQueryKey)),
            SortBy = NullIfWhiteSpace(query.Get(SortByQueryKey)),
            SortDirection = ParseSortDirection(query.Get(SortDirectionQueryKey)),
            SearchBy = NullIfWhiteSpace(query.Get(SearchByQueryKey)),
            SearchTerm = NullIfWhiteSpace(query.Get(SearchTermQueryKey)),
            FilterMatch = ParseFilterMatch(query.Get(FilterMatchQueryKey)),
            Filters = ParseFilters(query.GetValues(FiltersQueryKey)),
            Include = NullIfWhiteSpace(query.Get(IncludeQueryKey))
        };
    }

    private static int ParsePageSize(string? value, int defaultPageSize, int maxPageSize)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(defaultPageSize);
        ArgumentOutOfRangeException.ThrowIfLessThan(maxPageSize, defaultPageSize);

        if (string.IsNullOrWhiteSpace(value)) return defaultPageSize;
        if (!int.TryParse(value, out var pageSize)) throw new ArgumentOutOfRangeException(nameof(value), "Page size must be a valid number.");
        if (pageSize < 1 || pageSize > maxPageSize) throw new ArgumentOutOfRangeException(nameof(value), $"Page size must be between 1 and {maxPageSize}.");

        return pageSize;
    }

    private static SortDirection? ParseSortDirection(string? value)
    {
        return NullIfWhiteSpace(value)?.ToLowerInvariant() switch {
            null => null,
            "asc" => SortDirection.Asc,
            "desc" => SortDirection.Desc,
            _ => throw new ArgumentOutOfRangeException(nameof(value), "Sort direction must be 'asc' or 'desc'.")
        };
    }

    private static FilterMatch? ParseFilterMatch(string? value)
    {
        return NullIfWhiteSpace(value)?.ToLowerInvariant() switch {
            null => null,
            "all" => FilterMatch.All,
            "any" => FilterMatch.Any,
            _ => throw new ArgumentOutOfRangeException(nameof(value), "Filter match must be 'all' or 'any'.")
        };
    }

    private static IReadOnlyCollection<QueryFilter> ParseFilters(string[]? values)
    {
        if (values is null || values.Length == 0) return [];

        return values
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(ParseFilter)
            .ToArray();
    }

    private static QueryFilter ParseFilter(string value)
    {
        var parts = value.Split(FilterSeparator, 3, StringSplitOptions.TrimEntries);
        if (parts.Length != 3 || parts.Any(string.IsNullOrWhiteSpace)) {
            throw new ArgumentException("Filters must use the 'field:operator:value' format.", nameof(value));
        }

        return new QueryFilter(parts[0], ParseFilterOperator(parts[1]), parts[2]);
    }

    private static FilterOperator ParseFilterOperator(string value)
    {
        return value.Trim().ToLowerInvariant() switch {
            "equals" => FilterOperator.Equals,
            "notequals" => FilterOperator.NotEquals,
            "contains" => FilterOperator.Contains,
            "notcontains" => FilterOperator.NotContains,
            "startswith" => FilterOperator.StartsWith,
            "endswith" => FilterOperator.EndsWith,
            "before" => FilterOperator.Before,
            "after" => FilterOperator.After,
            "between" => FilterOperator.Between,
            "greaterthan" => FilterOperator.GreaterThan,
            "lessthan" => FilterOperator.LessThan,
            "greaterthanorequal" => FilterOperator.GreaterThanOrEqual,
            "lessthanorequal" => FilterOperator.LessThanOrEqual,
            _ => throw new ArgumentOutOfRangeException(nameof(value), $"Filter operator '{value}' is not supported.")
        };
    }

    private static string? NullIfWhiteSpace(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    public static async Task<HttpResponseData> CreateJsonResponseAsync<TResponse>(this HttpRequestData request, HttpStatusCode statusCode, TResponse body, CancellationToken cancellationToken)
    {
        var response = request.CreateResponse(statusCode);
        await response.WriteAsJsonAsync(body, cancellationToken);
        return response;
    }
}
