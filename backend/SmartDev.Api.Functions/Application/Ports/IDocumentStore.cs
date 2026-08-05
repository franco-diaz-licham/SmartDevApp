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
    /// <param name="queryText">The SQL query text.</param>
    /// <param name="parameters">The query parameters.</param>
    /// <param name="partitionKey">The optional partition key to scope the query.</param>
    /// <param name="cancellationToken">The token used to cancel the operation.</param>
    /// <returns>The documents returned by the query.</returns>
    Task<IReadOnlyCollection<TDocument>> QueryAsync<TDocument>(
        string containerName,
        string queryText,
        IReadOnlyDictionary<string, object?>? parameters = null,
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
