using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.Domain;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.UpdateOwnerArticle;

public sealed class UpdateOwnerArticleHandler(IArticleRepository articleRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<Result<UpdateArticleResult>> HandleAsync(UpdateArticleCommand command, CancellationToken cancellationToken)
    {
        try {
            if (command.Category is null) return Result<UpdateArticleResult>.Fail("Article category is required.", ResultTypeEnum.Invalid);

            var article = await articleRepository.GetByIdAsync(ArticleId.From(command.ArticleId), cancellationToken);
            if (article is null) return Result<UpdateArticleResult>.Fail($"Article {command.ArticleId:D} was not found.", ResultTypeEnum.NotFound);

            var now = DateTimeOffset.UtcNow;
            article.Rename(ArticleTitle.Create(command.Title), ArticleSlug.Create(command.Slug), now);
            article.UpdateSummary(ArticleSummary.Create(command.Summary), now);
            article.ChangeType(command.ArticleType, now);
            article.ChangeCategory(ArticleCategorySnapshot.Create(ArticleCategorySlug.Create(command.Category.Slug), command.Category.DisplayName), now);
            article.ReplaceTags((command.Tags ?? []).Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag.Slug), tag.DisplayName)), now);
            article.UpdateBody(MarkdownContent.Create(command.BodyMarkdown), now);
            article.ChangePublication(command.Status, command.Visibility, now);

            await articleRepository.SaveAsync(article, cancellationToken);
            await domainEventDispatcher.DispatchAsync(article.DomainEvents, cancellationToken);
            article.ClearDomainEvents();

            return Result<UpdateArticleResult>.Success(new UpdateArticleResult(article.Id.Value, article.Slug.Value));
        } catch (ArgumentException exception) {
            return Result<UpdateArticleResult>.Fail(exception.Message, ResultTypeEnum.Invalid);
        } catch (InvalidOperationException exception) {
            return Result<UpdateArticleResult>.Fail(exception.Message, ResultTypeEnum.Conflict);
        }
    }
}
