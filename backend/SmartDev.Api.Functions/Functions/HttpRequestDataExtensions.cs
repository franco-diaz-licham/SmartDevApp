using System.Web;
using Microsoft.Azure.Functions.Worker.Http;

namespace SmartDev.Api.Functions.Functions;

internal static class HttpRequestDataExtensions
{
    private const string PageSizeQueryKey = "pageSize";
    private const string ContinuationTokenQueryKey = "continuationToken";

    public static CursorPageRequest GetCursorPageRequest(this HttpRequestData request, int defaultPageSize = 20, int maxPageSize = 100)
    {
        var query = HttpUtility.ParseQueryString(request.Url.Query);
        var pageSize = ParsePageSize(query.Get(PageSizeQueryKey), defaultPageSize, maxPageSize);
        var continuationToken = query.Get(ContinuationTokenQueryKey);
        return new CursorPageRequest(pageSize, continuationToken);
    }

    public static string GetQueryValue(this HttpRequestData request, string key, string fallback = "")
    {
        return HttpUtility.ParseQueryString(request.Url.Query).Get(key) ?? fallback;
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
}

internal sealed record CursorPageRequest(int PageSize, string? ContinuationToken);
