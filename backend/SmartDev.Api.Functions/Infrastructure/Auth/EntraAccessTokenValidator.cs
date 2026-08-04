using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Infrastructure.Auth;

public sealed class EntraAccessTokenValidator(IOptions<EntraIdOptions> options) : IAccessTokenValidator
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
            ValidIssuer = _options.Authority,
            ValidateAudience = true,
            ValidAudience = _options.Audience,
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
        } catch (SecurityTokenException) {
            return null;
        } catch (ArgumentException) {
            return null;
        }
    }
}

