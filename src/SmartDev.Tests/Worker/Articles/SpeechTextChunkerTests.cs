using SmartDev.Worker.Functions.Features.Articles.Narration;

namespace SmartDev.Tests.Worker.Articles;

public sealed class SpeechTextChunkerTests
{
    [Test]
    public void Split_TextShorterThanMaximumLength_ReturnsOneChunk()
    {
        // Arrange
        const string text = "This is a short article narration.";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 100);

        // Assert
        chunks.ShouldBe(["This is a short article narration."]);
    }

    [Test]
    public void Split_TextLongerThanMaximumLength_ReturnsChunksWithinMaximumLength()
    {
        // Arrange
        const string text = "one two three four five six seven eight nine ten";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 13);

        // Assert
        chunks.ShouldAllBe(chunk => chunk.Length <= 13);
        string.Join(' ', chunks).ShouldBe(text);
    }

    [Test]
    public void Split_SingleWordLongerThanMaximumLength_SplitsWordWithinMaximumLength()
    {
        // Arrange
        const string text = "abcdefghij";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 4);

        // Assert
        chunks.ShouldBe(["abcd", "efgh", "ij"]);
    }
}
