namespace SmartDev.Api.Functions.Domain.Common;

/// <summary>
/// Provides validation helpers used by domain value objects and aggregates.
/// </summary>
internal static class Guard
{
    /// <summary>
    /// Trims and validates a required string value.
    /// </summary>
    public static string Required(string value, string parameterName, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException($"{parameterName} is required.", parameterName);
        var trimmed = value.Trim();
        if (trimmed.Length > maxLength) throw new ArgumentException($"{parameterName} must be {maxLength} characters or less.", parameterName);
        return trimmed;
    }

    /// <summary>
    /// Trims and validates an optional string value.
    /// </summary>
    public static string? Optional(string? value, string parameterName, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var trimmed = value.Trim();
        if (trimmed.Length > maxLength) throw new ArgumentException($"{parameterName} must be {maxLength} characters or less.", parameterName);
        return trimmed;
    }

    /// <summary>
    /// Validates that a string collection has at least one trimmed item.
    /// </summary>
    public static IReadOnlyList<string> RequiredList(IEnumerable<string> values, string parameterName, int itemMaxLength)
    {
        var items = values
            .Select(value => Required(value, parameterName, itemMaxLength))
            .ToArray();

        if (items.Length == 0) throw new ArgumentException($"{parameterName} must contain at least one item.", parameterName);
        return items;
    }

    /// <summary>
    /// Validates that a collection contains at least one item.
    /// </summary>
    public static IReadOnlyList<T> EnsureAny<T>(IEnumerable<T> values, string parameterName)
    {
        var items = values.ToArray();
        if (items.Length == 0) throw new ArgumentException($"{parameterName} must contain at least one item.", parameterName);
        return items;
    }
}
