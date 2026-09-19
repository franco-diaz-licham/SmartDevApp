using System.Security.Cryptography;
using System.Text;

namespace SmartDev.Shared.Articles;

public static class ArticleNarrationContent
{
    public static string CreateVersion(string title, string summary, string bodyMarkdown)
    {
        var source = string.Join('\u001f', title.Trim(), summary.Trim(), bodyMarkdown.Trim());
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(source));
        return new Guid(hash[..16]).ToString("N");
    }

    public static string CreateNarrationMarkdown(string title, string summary, string bodyMarkdown)
    {
        return $"""
            # {title.Trim()}

            {summary.Trim()}

            {bodyMarkdown.Trim()}
            """;
    }
}
