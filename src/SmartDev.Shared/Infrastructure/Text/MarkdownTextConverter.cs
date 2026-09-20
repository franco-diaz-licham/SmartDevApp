using System.Net;
using System.Text.RegularExpressions;
using Markdig;
using Markdig.Extensions.Tables;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;

namespace SmartDev.Shared.Infrastructure.Text;

/// <summary>
/// Reads Markdown elements directly into plain narration text, with blank lines marking pauses.
/// </summary>
public sealed partial class MarkdownTextConverter : IMarkdownTextConverter
{
    private const string ParagraphSeparator = "\n\n";

    private static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder()
        .UsePipeTables()
        .UseTaskLists()
        .UseEmphasisExtras()
        .Build();

    /// <inheritdoc />
    public string Convert(string markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown)) return string.Empty;
        var document = Markdown.Parse(markdown, Pipeline);
        var readableText = ExtractReadableText(document);
        return NormalizeParagraphs(readableText);
    }

    private static string ExtractReadableText(ContainerBlock blocks)
    {
        return string.Join(ParagraphSeparator, blocks.Select(ExtractBlockText));
    }

    private static string ExtractBlockText(Block block)
    {
        return block switch {
            CodeBlock codeBlock => codeBlock.Lines.ToString().ReplaceLineEndings(ParagraphSeparator),
            Table => "Table omitted.",
            HtmlBlock htmlBlock => ExtractEmbeddedHtmlText(htmlBlock.Lines.ToString()),
            ContainerBlock containerBlock => ExtractReadableText(containerBlock),
            LeafBlock { Inline: not null } leafBlock => ExtractInlineText(leafBlock.Inline),
            _ => string.Empty
        };
    }

    private static string ExtractInlineText(ContainerInline inlines)
    {
        return string.Concat(inlines.Select(ExtractInlineText));
    }

    private static string ExtractInlineText(Inline inline)
    {
        return inline switch {
            LiteralInline literal => literal.Content.ToString(),
            CodeInline code => code.Content,
            HtmlEntityInline entity => entity.Transcoded.ToString(),
            LineBreakInline lineBreak => lineBreak.IsHard ? ParagraphSeparator : " ",
            LinkInline { IsImage: true } => string.Empty,
            AutolinkInline => string.Empty,
            HtmlInline htmlInline => ExtractEmbeddedHtmlText(htmlInline.Tag),
            ContainerInline containerInline => ExtractInlineText(containerInline),
            _ => string.Empty
        };
    }

    // Markdown may contain author-supplied HTML. Only those source elements need tag cleanup;
    // Markdown text and code never pass through HTML generation or stripping.
    private static string ExtractEmbeddedHtmlText(string html)
    {
        var text = HtmlCommentRegex().Replace(html, string.Empty);
        text = HtmlBlockBoundaryRegex().Replace(text, ParagraphSeparator);
        text = HtmlTagRegex().Replace(text, string.Empty);
        return WebUtility.HtmlDecode(text);
    }

    private static string NormalizeParagraphs(string text)
    {
        var paragraphs = text.ReplaceLineEndings("\n")
            .Split(ParagraphSeparator, StringSplitOptions.RemoveEmptyEntries)
            .Select(paragraph => WhitespaceRegex().Replace(paragraph, " ").Trim())
            .Where(paragraph => paragraph.Length > 0);

        return string.Join(ParagraphSeparator, paragraphs);
    }

    [GeneratedRegex(@"<!--.*?-->", RegexOptions.Singleline | RegexOptions.CultureInvariant)]
    private static partial Regex HtmlCommentRegex();

    [GeneratedRegex(@"</?(?:p|pre|div|h[1-6]|li|blockquote|br|hr)\b[^>]*>", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex HtmlBlockBoundaryRegex();

    [GeneratedRegex(@"<[^>]+>", RegexOptions.CultureInvariant)]
    private static partial Regex HtmlTagRegex();

    [GeneratedRegex(@"\s+", RegexOptions.CultureInvariant)]
    private static partial Regex WhitespaceRegex();
}

