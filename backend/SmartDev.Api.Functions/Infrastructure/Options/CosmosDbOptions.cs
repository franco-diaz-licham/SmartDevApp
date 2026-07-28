using System.ComponentModel.DataAnnotations;

namespace SmartDev.Api.Functions.Infrastructure.Options;

/// <summary>
/// Configures the Azure Cosmos DB document store.
/// </summary>
public sealed class CosmosDbOptions
{
    /// <summary>
    /// Gets the configuration section name used for Cosmos DB settings.
    /// </summary>
    public const string SectionName = "CosmosDb";

    /// <summary>
    /// Gets the Cosmos DB account connection string.
    /// </summary>
    [Required]
    public string ConnectionString { get; init; } = string.Empty;

    /// <summary>
    /// Gets the Cosmos DB database name used by SmartDevApp.
    /// </summary>
    [Required]
    public string DatabaseName { get; init; } = "smartdev";

    /// <summary>
    /// Gets the default container time-to-live value, in seconds, used when containers are created.
    /// </summary>
    [Range(60, int.MaxValue)]
    public int DefaultTimeToLiveSeconds { get; init; } = 86400;

    /// <summary>
    /// Gets the database throughput used when the Cosmos DB database is created.
    /// </summary>
    [Range(400, int.MaxValue)]
    public int Throughput { get; init; } = 1000;
}
