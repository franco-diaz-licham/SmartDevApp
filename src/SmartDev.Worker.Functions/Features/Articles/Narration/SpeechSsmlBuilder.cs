using System.Net;

namespace SmartDev.Worker.Functions.Features.Articles.Narration;

/// <summary>
/// Formats narration for Azure Speech, escaping article text before inserting pause markup.
/// </summary>
internal static class SpeechSsmlBuilder
{
    private const string ParagraphPause = """<break time="500ms" />""";

    /// <summary>
    /// Creates one speech request, retaining a trailing pause only when a reading block ends.
    /// </summary>
    internal static string Build(SpeechTextChunk chunk, string voiceName)
    {
        var encodedVoiceName = WebUtility.HtmlEncode(voiceName);
        var speechBody = BuildSpeechBody(chunk);

        return $"""
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en">
                <voice name="{encodedVoiceName}">{speechBody}</voice>
            </speak>
            """;
    }

    private static string BuildSpeechBody(SpeechTextChunk chunk)
    {
        var encodedParagraphs = chunk.Text
            .Split("\n\n", StringSplitOptions.RemoveEmptyEntries)
            .Select(WebUtility.HtmlEncode);

        var speechBody = string.Join(ParagraphPause, encodedParagraphs);
        return chunk.PauseAfter ? speechBody + ParagraphPause : speechBody;
    }
}
