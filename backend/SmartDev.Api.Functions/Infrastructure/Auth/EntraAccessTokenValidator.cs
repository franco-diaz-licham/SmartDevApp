using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Infrastructure.Auth;

public sealed class EntraAccessTokenValidator(IOptions<EntraIdOptions> options, ILogger<EntraAccessTokenValidator> logger) : IAccessTokenValidator
{
    private readonly EntraIdOptions _options = options.Value;
    private readonly JwtSecurityTokenHandler _tokenHandler = new();
    private readonly ConfigurationManager<OpenIdConnectConfiguration> _configurationManager = new(options.Value.MetadataAddress, new OpenIdConnectConfigurationRetriever());

    public async Task<ClaimsPrincipal?> ValidateAsync(string accessToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(accessToken)) return null;

        var configuration = await _configurationManager.GetConfigurationAsync(cancellationToken);
        var validationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidIssuers = GetValidIssuers(),
            ValidateAudience = true,
            ValidAudiences = GetValidAudiences(),
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = configuration.SigningKeys,
            ClockSkew = TimeSpan.FromMinutes(2)
        };

        try {
            return _tokenHandler.ValidateToken(accessToken, validationParameters, out _);
        } catch (SecurityTokenSignatureKeyNotFoundException) {
            _configurationManager.RequestRefresh();
            configuration = await _configurationManager.GetConfigurationAsync(cancellationToken);
            validationParameters.IssuerSigningKeys = configuration.SigningKeys;
            return _tokenHandler.ValidateToken(accessToken, validationParameters, out _);
        } catch (SecurityTokenException exception) {
            LogValidationFailure(accessToken, exception);
            return null;
        } catch (ArgumentException exception) {
            LogValidationFailure(accessToken, exception);
            return null;
        }
    }

    private IReadOnlyCollection<string> GetValidIssuers()
    {
        var tenantId = _options.TenantId.Trim();
        if (string.IsNullOrWhiteSpace(tenantId)) return [];

        return [
            $"https://login.microsoftonline.com/{tenantId}/v2.0",
            $"https://login.microsoftonline.com/{tenantId}/v2.0/",
            $"https://sts.windows.net/{tenantId}/"
        ];
    }

    private IReadOnlyCollection<string> GetValidAudiences()
    {
        var audience = _options.Audience.Trim();
        if (string.IsNullOrWhiteSpace(audience)) return [];

        const string apiAudiencePrefix = "api://";
        if (!audience.StartsWith(apiAudiencePrefix, StringComparison.OrdinalIgnoreCase)) return [audience];

        return [audience, audience[apiAudiencePrefix.Length..]];
    }

    private void LogValidationFailure(string accessToken, Exception exception)
    {
        try {
            var token = _tokenHandler.ReadJwtToken(accessToken);
            logger.LogWarning(
                exception,
                "Entra access token validation failed. Issuer: {Issuer}. Audiences: {Audiences}. TenantId: {TenantId}. Scopes: {Scopes}.",
                token.Issuer,
                string.Join(", ", token.Audiences),
                token.Claims.FirstOrDefault(claim => claim.Type == "tid")?.Value,
                token.Claims.FirstOrDefault(claim => claim.Type == "scp")?.Value);
        } catch (Exception readException) when (readException is ArgumentException or SecurityTokenException) {
            logger.LogWarning(exception, "Entra access token validation failed and the token could not be read.");
        }
    }
}
