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
        chunks.ShouldBe([new SpeechTextChunk(text, true)]);
    }

    [Test]
    public void Split_TextLongerThanMaximumLength_ReturnsChunksWithinMaximumLength()
    {
        // Arrange
        const string text = "one two three four five six seven eight nine ten";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 13);

        // Assert
        chunks.ShouldAllBe(chunk => chunk.Text.Length <= 13);
        string.Join(' ', chunks.Select(chunk => chunk.Text)).ShouldBe(text);
        chunks.SkipLast(1).ShouldAllBe(chunk => !chunk.PauseAfter);
        chunks[^1].PauseAfter.ShouldBeTrue();
    }

    [Test]
    public void Split_SingleWordLongerThanMaximumLength_SplitsWordWithinMaximumLength()
    {
        // Arrange
        const string text = "abcdefghij";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 4);

        // Assert
        chunks.Select(chunk => chunk.Text).ShouldBe(["abcd", "efgh", "ij"]);
    }

    [Test]
    public void Split_ParagraphsFitTogether_PreservesBoundariesWithoutExtraRequests()
    {
        // Arrange
        const string text = "Title\n\nBody text\n\nNext section";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 100);

        // Assert
        chunks.ShouldBe([new SpeechTextChunk(text, true)]);
    }

    [Test]
    public void Split_ParagraphBoundaryAtChunkLimit_PreservesPauseAfterHeading()
    {
        // Arrange
        const string text = "Heading\n\nFollowing text";

        // Act
        var chunks = SpeechTextChunker.Split(text, maximumChunkLength: 7);

        // Assert
        chunks[0].ShouldBe(new SpeechTextChunk("Heading", true));
        chunks.ShouldAllBe(chunk => chunk.Text.Length <= 7);
        chunks[1].PauseAfter.ShouldBeFalse();
    }

    [Test]
    public void Split_SoftLineWrap_JoinsWordsWithoutParagraphPause()
    {
        // Arrange
        const string text = "One wrapped\nline.";

        // Act
        var chunks = SpeechTextChunker.Split(text);

        // Assert
        chunks.ShouldBe([new SpeechTextChunk("One wrapped line.", true)]);
    }
}
