namespace SmartDev.Worker.Functions.Features.Articles.Narration;

internal static class SpeechTextChunker
{
    internal const int DefaultMaximumChunkLength = 2_800;

    internal static IReadOnlyList<string> Split(string text, int maximumChunkLength = DefaultMaximumChunkLength)
    {
        if (maximumChunkLength <= 0) throw new ArgumentOutOfRangeException(nameof(maximumChunkLength));
        if (string.IsNullOrWhiteSpace(text)) return [];

        var chunks = new List<string>();
        var currentChunk = string.Empty;

        foreach (var word in EnumerateWords(text)) currentChunk = AddWordToChunks(word, currentChunk, maximumChunkLength, chunks);
        if (!string.IsNullOrWhiteSpace(currentChunk)) chunks.Add(currentChunk);
        return chunks;
    }

    private static string AddWordToChunks(string word, string currentChunk, int maximumChunkLength, ICollection<string> chunks)
    {
        var wordExceedsMaximumLength = word.Length > maximumChunkLength;
        if (wordExceedsMaximumLength) {
            currentChunk = FlushCurrentChunk(currentChunk, chunks);
            SplitLongWord(word, maximumChunkLength, chunks);
            return currentChunk;
        }

        var currentChunkIsEmpty = string.IsNullOrWhiteSpace(currentChunk);
        if (currentChunkIsEmpty) return word;

        var wordFitsCurrentChunk = currentChunk.Length + 1 + word.Length <= maximumChunkLength;
        if (wordFitsCurrentChunk) return $"{currentChunk} {word}";

        chunks.Add(currentChunk);
        return word;
    }

    private static string FlushCurrentChunk(string currentChunk, ICollection<string> chunks)
    {
        if (string.IsNullOrWhiteSpace(currentChunk)) return currentChunk;
        chunks.Add(currentChunk);
        return string.Empty;
    }

    private static IEnumerable<string> EnumerateWords(string text)
    {
        return text
            .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(word => !string.IsNullOrWhiteSpace(word));
    }

    private static void SplitLongWord(string word, int maximumChunkLength, ICollection<string> chunks)
    {
        for (var offset = 0; offset < word.Length; offset += maximumChunkLength) {
            var length = Math.Min(maximumChunkLength, word.Length - offset);
            chunks.Add(word.Substring(offset, length));
        }
    }
}
