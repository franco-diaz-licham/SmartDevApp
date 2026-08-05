using System.Net;
using System.Text.Json;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Configuration.Options;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class CosmosDocumentStore(CosmosClient client, IOptions<CosmosDbOptions> options) : IDocumentStore
{
    private static readonly JsonSerializerOptions SerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    private readonly CosmosDbOptions _options = options.Value;

    public async Task EnsureContainerAsync(string containerName, string partitionKeyPath, int? defaultTimeToLiveSeconds = null, CancellationToken cancellationToken = default)
    {
        var databaseResponse = await client.CreateDatabaseIfNotExistsAsync(_options.DatabaseName, throughput: _options.Throughput, cancellationToken: cancellationToken);
        var properties = new ContainerProperties(containerName, partitionKeyPath) {
            DefaultTimeToLive = defaultTimeToLiveSeconds ?? _options.DefaultTimeToLiveSeconds
        };

        await databaseResponse.Database.CreateContainerIfNotExistsAsync(properties, cancellationToken: cancellationToken);
    }

    public async Task<TDocument?> GetAsync<TDocument>(string containerName, string id, string partitionKey, CancellationToken cancellationToken = default)
    {
        using var response = await GetContainer(containerName).ReadItemStreamAsync(id, new PartitionKey(partitionKey), cancellationToken: cancellationToken);
        if (response.StatusCode == HttpStatusCode.NotFound) return default;
        response.EnsureSuccessStatusCode();
        return await JsonSerializer.DeserializeAsync<TDocument>(response.Content, SerializerOptions, cancellationToken);
    }

    public async Task<IReadOnlyCollection<TDocument>> QueryAsync<TDocument>(string containerName, QueryDefinition query, string? partitionKey = null, CancellationToken cancellationToken = default)
    {
        var requestOptions = string.IsNullOrWhiteSpace(partitionKey) ? null : new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey) };

        var results = new List<TDocument>();
        using var iterator = GetContainer(containerName).GetItemQueryIterator<TDocument>(query, requestOptions: requestOptions);
        while (iterator.HasMoreResults) {
            var response = await iterator.ReadNextAsync(cancellationToken);
            results.AddRange(response);
        }

        return results;
    }

    public async Task<bool> TryCreateAsync<TDocument>(string containerName, TDocument document, string partitionKey, CancellationToken cancellationToken = default)
    {
        try {
            await GetContainer(containerName).CreateItemAsync(document, new PartitionKey(partitionKey), cancellationToken: cancellationToken);
            return true;
        } catch (CosmosException exception) when (exception.StatusCode == HttpStatusCode.Conflict) {
            return false;
        }
    }

    public async Task UpsertAsync<TDocument>(string containerName, TDocument document, string partitionKey, CancellationToken cancellationToken = default)
    {
        await GetContainer(containerName).UpsertItemAsync(document, new PartitionKey(partitionKey), cancellationToken: cancellationToken);
    }

    public async Task DeleteAsync(string containerName, string id, string partitionKey, CancellationToken cancellationToken = default)
    {
        try {
            await GetContainer(containerName).DeleteItemAsync<object>(id, new PartitionKey(partitionKey), cancellationToken: cancellationToken);
        } catch (CosmosException exception) when (exception.StatusCode == HttpStatusCode.NotFound) {
        }
    }

    private Container GetContainer(string containerName) => client.GetContainer(_options.DatabaseName, containerName);
}
