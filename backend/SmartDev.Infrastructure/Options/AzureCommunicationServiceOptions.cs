using System.ComponentModel.DataAnnotations;

namespace SmartDev.Infrastructure.Options;

/// <summary>
/// Configures Azure Communication Services email delivery.
/// </summary>
public sealed class AzureCommunicationServiceOptions
{
    /// <summary>
    /// Gets the configuration section name used for Azure Communication Services settings.
    /// </summary>
    public const string SectionName = "AzureCommunicationService";

    /// <summary>
    /// Gets the Azure Communication Services connection string.
    /// </summary>
    [Required]
    public string ConnectionString { get; init; } = string.Empty;

    /// <summary>
    /// Gets the sender address configured on the verified Azure Communication Services email domain.
    /// </summary>
    [Required]
    public string SenderAddress { get; init; } = string.Empty;
}
