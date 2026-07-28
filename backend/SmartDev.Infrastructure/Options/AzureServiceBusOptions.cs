using System.ComponentModel.DataAnnotations;

namespace SmartDev.Infrastructure.Options;

/// <summary>
/// Configures Azure Service Bus messaging.
/// </summary>
public sealed class AzureServiceBusOptions
{
    /// <summary>
    /// Gets the configuration section name used for Azure Service Bus settings.
    /// </summary>
    public const string SectionName = "AzureServiceBus";

    /// <summary>
    /// Gets the configuration key used by Azure Functions and MassTransit for the Service Bus connection string.
    /// </summary>
    public const string ConnectionStringConfigurationKey = SectionName + ":ConnectionString";

    /// <summary>
    /// Gets the Service Bus connection string.
    /// </summary>
    [Required]
    public string ConnectionString { get; init; } = string.Empty;

    /// <summary>
    /// Gets the number of messages MassTransit should prefetch from Service Bus.
    /// </summary>
    public int? PrefetchCount { get; init; } = 1;

    /// <summary>
    /// Gets the maximum number of messages MassTransit may process concurrently.
    /// </summary>
    public int? ConcurrentMessageLimit { get; init; } = 1;

    /// <summary>
    /// Gets the MassTransit consume timeout, in seconds.
    /// </summary>
    public int? TimeoutSeconds { get; init; } = 60;
}
