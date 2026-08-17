using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Application.UsesCases;
using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Api.Functions.Infrastructure.Persistence;

public sealed class CosmosArticleRepository(IDocumentStore documentStore) : IArticleRepository
{
    public async Task<Article?> GetByIdAsync(ArticleId id, CancellationToken cancellationToken)
    {
        var publicDocument = await documentStore.GetAsync<ArticleDocument>(
            ArticleDocument.ContainerName,
            id.Value.ToString("D"),
            ArticleDocument.PublicPartitionKey,
            cancellationToken);

        if (publicDocument is not null) return publicDocument.ToDomain();

        var privateDocument = await documentStore.GetAsync<ArticleDocument>(
            ArticleDocument.ContainerName,
            id.Value.ToString("D"),
            ArticleDocument.PrivatePartitionKey,
            cancellationToken);

        return privateDocument?.ToDomain();
    }

    public async Task<DocumentPage<Article>> GetPublishedPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<ArticleDocument>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.PublishedPublic(query),
            query.PageSize,
            query.ContinuationToken,
            ArticleDocument.PublicPartitionKey,
            cancellationToken);

        return new DocumentPage<Article>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public async Task<IReadOnlyCollection<Article>> GetPublishedPublicArticlesAsync(CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryAsync<ArticleDocument>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.PublishedPublic(),
            ArticleDocument.PublicPartitionKey,
            cancellationToken);

        return documents.Select(document => document.ToDomain()).ToArray();
    }

    public async Task<DocumentPage<Article>> SearchPublishedPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query.SearchTerm)) return new DocumentPage<Article>([], null);

        var documents = await documentStore.QueryPageAsync<ArticleDocument>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.PublishedPublicSearch(query.SearchTerm),
            query.PageSize,
            query.ContinuationToken,
            ArticleDocument.PublicPartitionKey,
            cancellationToken);

        return new DocumentPage<Article>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public Task<DocumentPage<string>> GetPublishedPublicCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        return documentStore.QueryPageAsync<string>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.PublishedPublicCategoryNames(),
            query.PageSize,
            query.ContinuationToken,
            ArticleDocument.PublicPartitionKey,
            cancellationToken);
    }

    public Task<DocumentPage<string>> GetOwnerCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        return documentStore.QueryPageAsync<string>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.OwnerCategoryNames(),
            query.PageSize,
            query.ContinuationToken,
            cancellationToken: cancellationToken);
    }

    public Task<DocumentPage<string>> GetPublishedPublicTagNamesAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        return documentStore.QueryPageAsync<string>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.PublishedPublicTagNames(),
            query.PageSize,
            query.ContinuationToken,
            ArticleDocument.PublicPartitionKey,
            cancellationToken);
    }

    public async Task<DocumentPage<Article>> GetAllForOwnerAsync(BaseQuery query, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<ArticleDocument>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.AllForOwner(query),
            query.PageSize,
            query.ContinuationToken,
            cancellationToken: cancellationToken);

        return new DocumentPage<Article>(documents.Items.Select(document => document.ToDomain()).ToArray(), documents.ContinuationToken);
    }

    public async Task AddAsync(Article article, CancellationToken cancellationToken)
    {
        if (await SlugExistsAsync(article.Slug, excludedArticleId: null, cancellationToken)) {
            throw new InvalidOperationException($"Article slug '{article.Slug.Value}' already exists.");
        }

        var created = await documentStore.TryCreateAsync(
            ArticleDocument.ContainerName,
            ArticleDocument.FromDomain(article),
            article.Visibility.ToString(),
            cancellationToken);

        if (!created) throw new InvalidOperationException($"Article {article.Id.Value:D} already exists.");
    }

    public async Task SaveAsync(Article article, CancellationToken cancellationToken)
    {
        if (await SlugExistsAsync(article.Slug, article.Id, cancellationToken)) {
            throw new InvalidOperationException($"Article slug '{article.Slug.Value}' already exists.");
        }

        var partitionKey = article.Visibility.ToString();
        var previousPartitionKey = partitionKey == ArticleDocument.PublicPartitionKey
            ? ArticleDocument.PrivatePartitionKey
            : ArticleDocument.PublicPartitionKey;

        await documentStore.UpsertAsync(
            ArticleDocument.ContainerName,
            ArticleDocument.FromDomain(article),
            partitionKey,
            cancellationToken);

        await documentStore.DeleteAsync(
            ArticleDocument.ContainerName,
            article.Id.Value.ToString("D"),
            previousPartitionKey,
            cancellationToken);
    }

    private async Task<bool> SlugExistsAsync(ArticleSlug slug, ArticleId? excludedArticleId, CancellationToken cancellationToken)
    {
        var documents = await documentStore.QueryPageAsync<string>(
            ArticleDocument.ContainerName,
            CosmosArticleQueries.SlugIds(slug),
            pageSize: 2,
            cancellationToken: cancellationToken);

        return documents.Items.Any(id => excludedArticleId is null || !string.Equals(id, excludedArticleId.Value.Value.ToString("D"), StringComparison.OrdinalIgnoreCase));
    }

}
