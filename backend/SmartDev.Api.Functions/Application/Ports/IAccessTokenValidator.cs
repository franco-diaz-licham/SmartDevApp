using System.Security.Claims;

namespace SmartDev.Api.Functions.Application.Ports;

/// <summary>
/// Validates access tokens presented to protected API endpoints.
/// </summary>
public interface IAccessTokenValidator
{
    /// <summary>
    /// Validates the supplied bearer access token and returns the authenticated claims principal when valid.
    /// </summary>
    /// <param name="accessToken">The bearer access token without the <c>Bearer</c> scheme prefix.</param>
    /// <param name="cancellationToken">The token used to cancel the validation operation.</param>
    /// <returns>The validated claims principal, or <c>null</c> when the token is missing, invalid, or expired.</returns>
    Task<ClaimsPrincipal?> ValidateAsync(string accessToken, CancellationToken cancellationToken);
}
