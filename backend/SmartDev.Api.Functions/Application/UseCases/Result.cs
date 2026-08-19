namespace SmartDev.Api.Functions.Application.UsesCases;

#pragma warning disable CA1000
/// <summary>
/// Carries the typed outcome of an application use case that returns a value.
/// </summary>
/// <typeparam name="T">The response model returned by the use case when it succeeds.</typeparam>
public sealed class Result<T>
{
    private Result(bool isSuccess, ResultTypeEnum type, T? value = default, AppError? error = null)
    {
        IsSuccess = isSuccess;
        Type = type;
        Value = value;
        Error = error;
    }

    /// <summary>
    /// Gets whether the use case completed successfully.
    /// </summary>
    public bool IsSuccess { get; }

    /// <summary>
    /// Gets the application outcome used by the API layer to select an HTTP status code.
    /// </summary>
    public ResultTypeEnum Type { get; }

    /// <summary>
    /// Gets the response value produced by a successful use case.
    /// </summary>
    public T? Value { get; }

    /// <summary>
    /// Gets the failure message when the use case did not complete successfully.
    /// </summary>
    public AppError? Error { get; }

    /// <summary>
    /// Creates a successful result for a use case that returned a value.
    /// </summary>
    public static Result<T> Success(T value, ResultTypeEnum type = ResultTypeEnum.Success) => new(true, type, value);

    /// <summary>
    /// Creates a failed result for an expected use-case failure.
    /// </summary>
    public static Result<T> Fail(string message, ResultTypeEnum type = ResultTypeEnum.Invalid) => new(false, type, error: new AppError(message));
}
#pragma warning restore CA1000

/// <summary>
/// Carries the outcome of an application use case that does not return a value.
/// </summary>
public sealed class Result
{
    private Result(bool isSuccess, ResultTypeEnum type, AppError? error = null)
    {
        IsSuccess = isSuccess;
        Type = type;
        Error = error;
    }

    /// <summary>
    /// Gets whether the use case completed successfully.
    /// </summary>
    public bool IsSuccess { get; }

    /// <summary>
    /// Gets the application outcome used by the API layer to select an HTTP status code.
    /// </summary>
    public ResultTypeEnum Type { get; }

    /// <summary>
    /// Gets the failure message when the use case did not complete successfully.
    /// </summary>
    public AppError? Error { get; }

    /// <summary>
    /// Creates a successful result for a use case that does not return a value.
    /// </summary>
    public static Result Success(ResultTypeEnum type = ResultTypeEnum.Success) => new(true, type);

    /// <summary>
    /// Creates a failed result for an expected use-case failure.
    /// </summary>
    public static Result Fail(string message, ResultTypeEnum type = ResultTypeEnum.Invalid) => new(false, type, new AppError(message));
}

/// <summary>
/// Describes an expected application failure that can be shown to the API caller.
/// </summary>
public sealed record AppError(string Message);
