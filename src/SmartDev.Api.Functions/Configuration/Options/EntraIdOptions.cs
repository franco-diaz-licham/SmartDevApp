using System.ComponentModel.DataAnnotations;

namespace SmartDev.Api.Functions.Configuration.Options;

/// <summary>
/// Configures Microsoft Entra ID token validation and owner-only admin authorization.
/// </summary>
public sealed class EntraIdOptions
{
    /// <summary>
    /// Gets the configuration section name used for Microsoft Entra ID options.
    /// </summary>
    public const string SectionName = "EntraId";

    /// <summary>
    /// Gets the Microsoft Entra tenant ID expected in access tokens.
    /// </summary>
    [Required]
    public string TenantId { get; init; } = string.Empty;

    /// <summary>
    /// Gets the expected token audience, usually the API application ID URI or API client ID.
    /// </summary>
    [Required]
    public string Audience { get; init; } = string.Empty;

    /// <summary>
    /// Gets the object ID of the Microsoft Entra user allowed to access owner-only admin endpoints.
    /// </summary>
    [Required]
    public string OwnerObjectId { get; init; } = string.Empty;

    /// <summary>
    /// Gets the Microsoft identity platform authority URL for the configured tenant.
    /// </summary>
    public string Authority => $"https://login.microsoftonline.com/{TenantId}/v2.0";

    /// <summary>
    /// Gets the OpenID Connect metadata address used to discover token issuer and signing keys.
    /// </summary>
    public string MetadataAddress => $"{Authority}/.well-known/openid-configuration";
}
