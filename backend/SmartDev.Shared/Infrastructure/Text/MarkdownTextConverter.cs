using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace SmartDev.Shared.Infrastructure.Text;

public sealed partial class MarkdownTextConverter : IMarkdownTextConverter
{
    private const string CodeBlockPlaceholder = "Code example omitted.";
    private const string TablePlaceholder = "Table omitted.";

    public string Convert(string markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown)) return string.Empty;

        var text = NormalizeLineEndings(markdown);
        text = HtmlCommentRegex().Replace(text, string.Empty);
        text = FencedCodeBlockRegex().Replace(text, $"\n\n{CodeBlockPlaceholder}\n\n");
        text = RemoveTables(text);
        text = ImageRegex().Replace(text, string.Empty);
        text = LinkRegex().Replace(text, "$1");
        text = ReferenceLinkRegex().Replace(text, "$1");
        text = AutoLinkRegex().Replace(text, string.Empty);
        text = HtmlTagRegex().Replace(text, string.Empty);
        text = WebUtility.HtmlDecode(text);
        text = InlineCodeRegex().Replace(text, "$1");
        text = StripMarkdownLineSyntax(text);
        text = MarkdownEmphasisRegex().Replace(text, "$1");
        text = EscapedMarkdownPunctuationRegex().Replace(text, "$1");

        return NormalizeSpacing(text);
    }

    private static string NormalizeLineEndings(string text) => text.ReplaceLineEndings("\n");

    private static string RemoveTables(string text)
    {
        var builder = new StringBuilder();
        var tableStarted = false;

        foreach (var line in text.Split('\n')) {
            if (IsTableLine(line)) {
                if (!tableStarted) {
                    builder.Append('\n');
                    builder.Append(TablePlaceholder);
                    builder.Append('\n');
                    tableStarted = true;
                }

                continue;
            }

            tableStarted = false;
            builder.Append(line);
            builder.Append('\n');
        }

        return builder.ToString();
    }

    private static bool IsTableLine(string line)
    {
        var trimmed = line.Trim();
        if (trimmed.Length < 3) return false;

        var pipeCount = trimmed.Count(character => character == '|');
        if (pipeCount < 2) return false;

        return trimmed.StartsWith("|", StringComparison.Ordinal) ||
            TableSeparatorRegex().IsMatch(trimmed);
    }

    private static string StripMarkdownLineSyntax(string text)
    {
        var builder = new StringBuilder();

        foreach (var sourceLine in text.Split('\n')) {
            var line = sourceLine.Trim();
            line = HorizontalRuleRegex().Replace(line, string.Empty);
            line = HeadingRegex().Replace(line, "$1");
            line = BlockQuoteRegex().Replace(line, "$1");
            line = TaskListItemRegex().Replace(line, "$1");
            line = ListItemRegex().Replace(line, "$1");
            builder.Append(line);
            builder.Append('\n');
        }

        return builder.ToString();
    }

    private static string NormalizeSpacing(string text)
    {
        var lines = text
            .Split('\n')
            .Select(line => WhitespaceRegex().Replace(line.Trim(), " "))
            .ToArray();

        var builder = new StringBuilder();
        var previousWasBlank = true;

        foreach (var line in lines) {
            if (string.IsNullOrWhiteSpace(line)) {
                if (!previousWasBlank) builder.Append('\n');
                previousWasBlank = true;
                continue;
            }

            builder.Append(line);
            builder.Append('\n');
            previousWasBlank = false;
        }

        return builder.ToString().Trim();
    }

    [GeneratedRegex(@"<!--.*?-->", RegexOptions.Singleline | RegexOptions.CultureInvariant)]
    private static partial Regex HtmlCommentRegex();

    [GeneratedRegex(@"(?ms)^[ \t]*(```|~~~).*?^[ \t]*\1[ \t]*$")]
    private static partial Regex FencedCodeBlockRegex();

    [GeneratedRegex(@"^\|?[\s:|-]+\|[\s:|-|]+$")]
    private static partial Regex TableSeparatorRegex();

    [GeneratedRegex(@"!\[[^\]]*\]\([^)]+\)", RegexOptions.CultureInvariant)]
    private static partial Regex ImageRegex();

    [GeneratedRegex(@"\[([^\]]+)\]\([^)]+\)", RegexOptions.CultureInvariant)]
    private static partial Regex LinkRegex();

    [GeneratedRegex(@"\[([^\]]+)\]\[[^\]]+\]", RegexOptions.CultureInvariant)]
    private static partial Regex ReferenceLinkRegex();

    [GeneratedRegex(@"<https?://[^>]+>", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex AutoLinkRegex();

    [GeneratedRegex(@"<[^>]+>", RegexOptions.CultureInvariant)]
    private static partial Regex HtmlTagRegex();

    [GeneratedRegex(@"`([^`]+)`", RegexOptions.CultureInvariant)]
    private static partial Regex InlineCodeRegex();

    [GeneratedRegex(@"^[-*_]{3,}$", RegexOptions.CultureInvariant)]
    private static partial Regex HorizontalRuleRegex();

    [GeneratedRegex(@"^#{1,6}\s+(.+)$", RegexOptions.CultureInvariant)]
    private static partial Regex HeadingRegex();

    [GeneratedRegex(@"^>\s?(.+)$", RegexOptions.CultureInvariant)]
    private static partial Regex BlockQuoteRegex();

    [GeneratedRegex(@"^[-*+]\s+\[[ xX]\]\s+(.+)$", RegexOptions.CultureInvariant)]
    private static partial Regex TaskListItemRegex();

    [GeneratedRegex(@"^(?:[-*+]|\d+[.)])\s+(.+)$", RegexOptions.CultureInvariant)]
    private static partial Regex ListItemRegex();

    [GeneratedRegex(@"[*_~]{1,3}([^*_~]+)[*_~]{1,3}", RegexOptions.CultureInvariant)]
    private static partial Regex MarkdownEmphasisRegex();

    [GeneratedRegex(@"\\([\\`*_{}\[\]()#+\-.!|>])", RegexOptions.CultureInvariant)]
    private static partial Regex EscapedMarkdownPunctuationRegex();

    [GeneratedRegex(@"\s+", RegexOptions.CultureInvariant)]
    private static partial Regex WhitespaceRegex();
}

