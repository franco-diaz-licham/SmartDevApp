using System.Security.Claims;
using Microsoft.Extensions.Options;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Infrastructure.Auth;

public sealed class AdminAccessAuthorizer(IOptions<EntraIdOptions> options) : IAdminAccessAuthorizer
{
    private readonly EntraIdOptions _options = options.Value;

    public bool CanAccessAdminArea(ClaimsPrincipal principal)
    {
        var objectId = FindClaimValue(principal, "oid", "http://schemas.microsoft.com/identity/claims/objectidentifier");
        var tenantId = FindClaimValue(principal, "tid", "http://schemas.microsoft.com/identity/claims/tenantid");

        return string.Equals(objectId, _options.OwnerObjectId, StringComparison.OrdinalIgnoreCase) && string.Equals(tenantId, _options.TenantId, StringComparison.OrdinalIgnoreCase);
    }

    private static string? FindClaimValue(ClaimsPrincipal principal, params string[] claimTypes)
    {
        foreach (var claimType in claimTypes) {
            var value = principal.Claims.FirstOrDefault(claim => string.Equals(claim.Type, claimType, StringComparison.OrdinalIgnoreCase))?.Value;
            if (!string.IsNullOrWhiteSpace(value)) return value;
        }

        return null;
    }
}

