using System.ComponentModel.DataAnnotations;

namespace SmartDev.Shared.Options;

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
    /// Gets the app setting name used by Azure Functions Service Bus bindings.
    /// </summary>
    /// <remarks>
    /// Azure Functions binding attributes require the name of the app setting that
    /// contains the connection string, not the connection string value itself.
    /// </remarks>
    public const string ConnectionStringAppSettingName = "AzureServiceBus__ConnectionString";

    /// <summary>
    /// Gets the Service Bus connection string.
    /// </summary>
    [Required]
    public string ConnectionString { get; init; } = string.Empty;

    /// <summary>
    /// Gets the Service Bus administration connection string used for topology operations.
    /// The local emulator exposes administration operations on port 5300.
    /// </summary>
    public string? AdministrationConnectionString { get; init; }

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
