namespace SmartDev.Api.Functions.Application.UsesCases;

/// <summary>
/// Identifies the application-level outcome of a use case before it is translated to an HTTP response.
/// </summary>
public enum ResultTypeEnum
{
    /// <summary>
    /// The use case completed successfully and should be returned as a standard success response.
    /// </summary>
    Success,

    /// <summary>
    /// The use case accepted work for asynchronous processing.
    /// </summary>
    Accepted,

    /// <summary>
    /// The use case created a new resource.
    /// </summary>
    Created,

    /// <summary>
    /// The requested resource could not be found.
    /// </summary>
    NotFound,

    /// <summary>
    /// The submitted request is invalid for the use case.
    /// </summary>
    Invalid,

    /// <summary>
    /// The caller is not authenticated for the requested use case.
    /// </summary>
    Unauthorized,

    /// <summary>
    /// The caller is authenticated but cannot access the requested use case.
    /// </summary>
    Forbidden,

    /// <summary>
    /// The use case conflicts with current application state.
    /// </summary>
    Conflict,

    /// <summary>
    /// The use case failed for an unexpected reason.
    /// </summary>
    Unexpected
}
