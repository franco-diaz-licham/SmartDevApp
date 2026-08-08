using Microsoft.Azure.Cosmos;

namespace SmartDev.Api.Functions.Application.Ports;

/// <summary>
/// Provides low-level document persistence operations.
/// </summary>
public interface IDocumentStore
{
    /// <summary>
    /// Ensures that the backing container exists.
    /// </summary>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="partitionKeyPath">The partition key path used by the container.</param>
    /// <param name="defaultTimeToLiveSeconds">The optional default document time-to-live in seconds.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task EnsureContainerAsync(
        string containerName,
        string partitionKeyPath,
        int? defaultTimeToLiveSeconds = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a document by identifier and partition key.
    /// </summary>
    /// <typeparam name="TDocument">The document type to read.</typeparam>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="id">The document identifier.</param>
    /// <param name="partitionKey">The document partition key.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    /// <returns>The document when it exists; otherwise, <see langword="null" />.</returns>
    Task<TDocument?> GetAsync<TDocument>(
        string containerName,
        string id,
        string partitionKey,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Queries documents from a container.
    /// </summary>
    /// <typeparam name="TDocument">The document type to read.</typeparam>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="query">The parameterised Cosmos SQL query.</param>
    /// <param name="partitionKey">The optional partition key to scope the query.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    /// <returns>The documents returned by the query.</returns>
    Task<IReadOnlyCollection<TDocument>> QueryAsync<TDocument>(
        string containerName,
        QueryDefinition query,
        string? partitionKey = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Queries one page of documents from a container using the backing document database cursor.
    /// </summary>
    /// <typeparam name="TDocument">The document type to read.</typeparam>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="query">The parameterised Cosmos SQL query.</param>
    /// <param name="pageSize">The maximum number of documents to read.</param>
    /// <param name="continuationToken">The opaque continuation token returned by a previous query page.</param>
    /// <param name="partitionKey">The optional partition key to scope the query.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    /// <returns>The documents returned by the query page and the next continuation token.</returns>
    Task<DocumentPage<TDocument>> QueryPageAsync<TDocument>(
        string containerName,
        QueryDefinition query,
        int pageSize,
        string? continuationToken = null,
        string? partitionKey = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a document when a document with the same identifier does not already exist.
    /// </summary>
    /// <typeparam name="TDocument">The document type to create.</typeparam>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="document">The document to create.</param>
    /// <param name="partitionKey">The document partition key.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    /// <returns><see langword="true" /> when the document was created; otherwise, <see langword="false" />.</returns>
    Task<bool> TryCreateAsync<TDocument>(
        string containerName,
        TDocument document,
        string partitionKey,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates or replaces a document.
    /// </summary>
    /// <typeparam name="TDocument">The document type to upsert.</typeparam>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="document">The document to create or replace.</param>
    /// <param name="partitionKey">The document partition key.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task UpsertAsync<TDocument>(
        string containerName,
        TDocument document,
        string partitionKey,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a document by identifier and partition key.
    /// </summary>
    /// <param name="containerName">The name of the document container.</param>
    /// <param name="id">The document identifier.</param>
    /// <param name="partitionKey">The document partition key.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    Task DeleteAsync(
        string containerName,
        string id,
        string partitionKey,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Represents one cursor-paged result from the document database.
/// </summary>
/// <typeparam name="TDocument">The document type contained in the page.</typeparam>
public sealed record DocumentPage<TDocument>(
    IReadOnlyCollection<TDocument> Items,
    string? ContinuationToken)
{
    /// <summary>
    /// Gets whether another page can be requested.
    /// </summary>
    public bool HasMore => !string.IsNullOrWhiteSpace(ContinuationToken);
}
