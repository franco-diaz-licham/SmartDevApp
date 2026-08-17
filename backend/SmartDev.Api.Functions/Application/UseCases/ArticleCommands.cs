using SmartDev.Api.Functions.Application.Ports;
using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Api.Functions.Application.UsesCases;

public sealed record CreateArticleCommand(
    string Title,
    string Slug,
    string Summary,
    CreateArticleCategory Category,
    IReadOnlyCollection<CreateArticleTag> Tags,
    string BodyMarkdown,
    ArticleStatus Status,
    ArticleVisibility Visibility);

public sealed record CreateArticleCategory(string Slug, string DisplayName);

public sealed record CreateArticleTag(string Slug, string DisplayName);

public sealed record CreateArticleResult(Guid ArticleId, string Slug);

public sealed record UpdateArticleCommand(
    Guid ArticleId,
    string Title,
    string Slug,
    string Summary,
    CreateArticleCategory Category,
    IReadOnlyCollection<CreateArticleTag> Tags,
    string BodyMarkdown,
    ArticleStatus Status,
    ArticleVisibility Visibility);

public sealed record UpdateArticleResult(Guid ArticleId, string Slug);

public sealed class CreateArticleHandler(IArticleRepository articleRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<CreateArticleResult> HandleAsync(CreateArticleCommand command, CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;
        var article = Article.CreateDraft(
            ArticleId.New(),
            ArticleTitle.Create(command.Title),
            ArticleSlug.Create(command.Slug),
            ArticleSummary.Create(command.Summary),
            ArticleCategorySnapshot.Create(ArticleCategorySlug.Create(command.Category.Slug), command.Category.DisplayName),
            MarkdownContent.Create(command.BodyMarkdown),
            command.Tags.Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag.Slug), tag.DisplayName)),
            relatedProjects: [],
            now);

        article.ChangePublication(command.Status, command.Visibility, now);

        await articleRepository.AddAsync(article, cancellationToken);
        await domainEventDispatcher.DispatchAsync(article.DomainEvents, cancellationToken);
        article.ClearDomainEvents();

        return new CreateArticleResult(article.Id.Value, article.Slug.Value);
    }
}

public sealed class UpdateArticleHandler(IArticleRepository articleRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<UpdateArticleResult> HandleAsync(UpdateArticleCommand command, CancellationToken cancellationToken)
    {
        var article = await articleRepository.GetByIdAsync(ArticleId.From(command.ArticleId), cancellationToken);
        if (article is null) throw new KeyNotFoundException($"Article {command.ArticleId:D} was not found.");

        var now = DateTimeOffset.UtcNow;
        article.Rename(ArticleTitle.Create(command.Title), ArticleSlug.Create(command.Slug), now);
        article.UpdateSummary(ArticleSummary.Create(command.Summary), now);
        article.ChangeCategory(ArticleCategorySnapshot.Create(ArticleCategorySlug.Create(command.Category.Slug), command.Category.DisplayName), now);
        article.ReplaceTags(command.Tags.Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag.Slug), tag.DisplayName)), now);
        article.UpdateBody(MarkdownContent.Create(command.BodyMarkdown), now);
        article.ChangePublication(command.Status, command.Visibility, now);

        await articleRepository.SaveAsync(article, cancellationToken);
        await domainEventDispatcher.DispatchAsync(article.DomainEvents, cancellationToken);
        article.ClearDomainEvents();

        return new UpdateArticleResult(article.Id.Value, article.Slug.Value);
    }
}
