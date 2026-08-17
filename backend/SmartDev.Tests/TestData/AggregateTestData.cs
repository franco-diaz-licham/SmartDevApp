using SmartDev.Api.Functions.Domain.Contact;
using SmartDev.Api.Functions.Domain.Articles;

namespace SmartDev.Tests.TestData;

internal static class AggregateTestData
{
    public static ContactMessage CreateContactMessage(
        string senderName = "Ada Lovelace",
        string senderEmail = "ada@example.com",
        string message = "Hello",
        DateTimeOffset? submittedAt = null)
    {
        return ContactMessage.Create(
            senderName: senderName,
            senderEmail: senderEmail,
            message: message,
            submittedAt: submittedAt ?? DateTimeOffset.UtcNow);
    }

    public static Article CreateArticle(
        string title = "Azure Functions Articles",
        string slug = "azure-functions-articles",
        string summary = "Useful articles about Azure Functions.",
        string category = "Backend",
        string bodyMarkdown = "# Azure Functions\n\nArticles.",
        IEnumerable<string>? tags = null,
        DateTimeOffset? createdAt = null)
    {
        return Article.CreateDraft(
            id: ArticleId.New(),
            title: ArticleTitle.Create(title),
            slug: ArticleSlug.Create(slug),
            summary: ArticleSummary.Create(summary),
            category: ArticleCategorySnapshot.Create(ArticleCategorySlug.Create(ToSlug(category)), category.Trim()),
            body: MarkdownContent.Create(bodyMarkdown),
            tags: (tags ?? ["azure-functions", "dotnet"])
                .Select(tag => ArticleTagSnapshot.Create(ArticleTagSlug.Create(tag), ToDisplayName(tag))),
            relatedProjects: [],
            now: createdAt ?? DateTimeOffset.UtcNow);
    }

    public static ArticleCategory CreateArticleCategory(string slug = "backend", string displayName = "Backend")
    {
        return ArticleCategory.Create(ArticleCategorySlug.Create(slug), displayName);
    }

    public static ArticleTag CreateArticleTag(string slug = "dotnet", string displayName = ".NET", IEnumerable<string>? aliases = null)
    {
        return ArticleTag.Create(ArticleTagSlug.Create(slug), displayName, aliases);
    }

    private static string ToSlug(string value)
    {
        return value.Trim().ToLowerInvariant().Replace(" ", "-");
    }

    private static string ToDisplayName(string slug)
    {
        return slug switch {
            "dotnet" => ".NET",
            "azure-functions" => "Azure Functions",
            _ => slug.Trim()
        };
    }
}
