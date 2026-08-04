using System.Security.Claims;

namespace SmartDev.Api.Functions.Application.Ports;

/// <summary>
/// Determines whether an authenticated principal can access owner-only administration endpoints.
/// </summary>
public interface IAdminAccessAuthorizer
{
    /// <summary>
    /// Checks whether the authenticated principal is authorised to access the admin area.
    /// </summary>
    /// <param name="principal">The validated authenticated principal.</param>
    /// <returns><c>true</c> when the principal is allowed to access admin endpoints; otherwise, <c>false</c>.</returns>
    bool CanAccessAdminArea(ClaimsPrincipal principal);
}
