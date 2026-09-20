namespace SmartDev.Worker.Functions.Features.Articles.Narration;

internal static class SpeechTextChunker
{
    internal const int DefaultMaximumChunkLength = 2_800;
    private const string ParagraphSeparator = "\n\n";

    /// <summary>
    /// Splits narration into bounded requests while preserving pauses at paragraph boundaries.
    /// </summary>
    internal static IReadOnlyList<SpeechTextChunk> Split(string text, int maximumChunkLength = DefaultMaximumChunkLength)
    {
        if (maximumChunkLength <= 0) throw new ArgumentOutOfRangeException(nameof(maximumChunkLength));
        if (string.IsNullOrWhiteSpace(text)) return [];

        var chunks = new List<SpeechTextChunk>();
        var paragraphs = text.ReplaceLineEndings("\n").Split(ParagraphSeparator, StringSplitOptions.RemoveEmptyEntries);

        foreach (var paragraph in paragraphs) {
            AppendParagraph(paragraph, maximumChunkLength, chunks);
        }

        return chunks;
    }

    private static void AppendParagraph(string paragraph, int maximumChunkLength, List<SpeechTextChunk> chunks)
    {
        var paragraphChunks = SplitParagraph(paragraph, maximumChunkLength);
        if (paragraphChunks.Count == 0) return;

        var lastChunkIndex = paragraphChunks.Count - 1;
        for (var index = 0; index < paragraphChunks.Count; index++) {
            var chunk = new SpeechTextChunk(
                Text: paragraphChunks[index],
                PauseAfter: index == lastChunkIndex);

            var canJoinPreviousParagraph = index == 0 && chunks.Count > 0;
            if (canJoinPreviousParagraph && TryJoinPreviousChunk(chunk, maximumChunkLength, chunks)) continue;

            chunks.Add(chunk);
        }
    }

    private static bool TryJoinPreviousChunk(SpeechTextChunk chunk, int maximumChunkLength, List<SpeechTextChunk> chunks)
    {
        var previousChunk = chunks[^1];
        var combinedLength = previousChunk.Text.Length + ParagraphSeparator.Length + chunk.Text.Length;
        if (combinedLength > maximumChunkLength) return false;

        chunks[^1] = new SpeechTextChunk(
            Text: previousChunk.Text + ParagraphSeparator + chunk.Text,
            PauseAfter: chunk.PauseAfter);
        return true;
    }

    private static List<string> SplitParagraph(string paragraph, int maximumChunkLength)
    {
        var chunks = new List<string>();
        var currentChunk = string.Empty;
        var words = paragraph.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);

        foreach (var word in words) {
            currentChunk = AddWordToChunks(word, currentChunk, maximumChunkLength, chunks);
        }

        if (currentChunk.Length > 0) chunks.Add(currentChunk);
        return chunks;
    }

    private static string AddWordToChunks(string word, string currentChunk, int maximumChunkLength, ICollection<string> chunks)
    {
        var wordExceedsMaximumLength = word.Length > maximumChunkLength;
        if (wordExceedsMaximumLength) {
            if (currentChunk.Length > 0) chunks.Add(currentChunk);
            SplitLongWord(word, maximumChunkLength, chunks);
            return string.Empty;
        }

        if (currentChunk.Length == 0) return word;

        var wordFitsCurrentChunk = currentChunk.Length + 1 + word.Length <= maximumChunkLength;
        if (wordFitsCurrentChunk) return $"{currentChunk} {word}";

        chunks.Add(currentChunk);
        return word;
    }

    private static void SplitLongWord(string word, int maximumChunkLength, ICollection<string> chunks)
    {
        for (var offset = 0; offset < word.Length; offset += maximumChunkLength) {
            var length = Math.Min(maximumChunkLength, word.Length - offset);
            chunks.Add(word.Substring(offset, length));
        }
    }
}
