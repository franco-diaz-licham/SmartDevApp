using SmartDev.Api.Functions.Common.Application;
using SmartDev.Api.Functions.Features.Articles.Contracts;
using SmartDev.Api.Functions.Features.Articles.Domain;

namespace SmartDev.Api.Functions.Features.Articles.UseCases.CreateOwnerArticle;

public sealed class CreateOwnerArticleHandler(IArticleRepository articleRepository, IDomainEventDispatcher domainEventDispatcher)
{
    public async Task<Result<CreateArticleResult>> HandleAsync(CreateArticleCommand command, CancellationToken cancellationToken)
    {
        try {
            if (command.Category is null) return Result<CreateArticleResult>.Fail("Article category is required.", ResultTypeEnum.Invalid);

            var now = DateTimeOffset.UtcNow;
            var article = Article.CreateDraft(
                ArticleId.New(),
                ArticleTitle.Create(command.Title),
                ArticleSlug.Create(command.Slug),
                ArticleSummary.Create(command.Summary),
                command.ArticleType,
                ArticleCategorySnapshot.Create(ArticleCategorySlug.Create(command.Category.Slug), command.Category.DisplayName),
                MarkdownContent.Create(command.BodyMarkdown),
                (command.Tags ?? []).Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag.Slug), tag.DisplayName)),
                relatedProjects: [],
                now);

            article.ChangePublication(command.Status, command.Visibility, now);

            await articleRepository.AddAsync(article, cancellationToken);
            await domainEventDispatcher.DispatchAsync(article.DomainEvents, cancellationToken);
            article.ClearDomainEvents();

            return Result<CreateArticleResult>.Success(new CreateArticleResult(article.Id.Value, article.Slug.Value), ResultTypeEnum.Created);
        } catch (ArgumentException exception) {
            return Result<CreateArticleResult>.Fail(exception.Message, ResultTypeEnum.Invalid);
        } catch (InvalidOperationException exception) {
            return Result<CreateArticleResult>.Fail(exception.Message, ResultTypeEnum.Conflict);
        }
    }
}
