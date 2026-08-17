using SmartDev.Api.Functions.Domain.Articles;
using SmartDev.Api.Functions.Application.UsesCases;

namespace SmartDev.Api.Functions.Application.Ports;

public interface IArticleRepository
{
    Task<Article?> GetByIdAsync(ArticleId id, CancellationToken cancellationToken);

    Task<DocumentPage<Article>> GetPublishedPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<Article>> GetPublishedPublicArticlesAsync(CancellationToken cancellationToken);

    Task<DocumentPage<Article>> SearchPublishedPublicArticlesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task<DocumentPage<string>> GetPublishedPublicCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task<DocumentPage<string>> GetOwnerCategoryNamesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task<DocumentPage<string>> GetPublishedPublicTagNamesAsync(BaseQuery query, CancellationToken cancellationToken);

    Task<DocumentPage<Article>> GetAllForOwnerAsync(BaseQuery query, CancellationToken cancellationToken);

    Task AddAsync(Article article, CancellationToken cancellationToken);

    Task SaveAsync(Article article, CancellationToken cancellationToken);
}
