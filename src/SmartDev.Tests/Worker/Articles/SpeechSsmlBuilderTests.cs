using System.Xml.Linq;
using SmartDev.Shared.Infrastructure.Text;
using SmartDev.Worker.Functions.Features.Articles.Narration;

namespace SmartDev.Tests.Worker.Articles;

public sealed class SpeechSsmlBuilderTests
{
    private static readonly XNamespace Synthesis = "http://www.w3.org/2001/10/synthesis";

    [Test]
    public void Build_MarkdownHeadingsAndListItems_SeparatesSpokenBlocksWithExplicitPauses()
    {
        // Arrange
        const string markdown = "# Heading\nBody\n## Subheading\n- First\n- Second";
        var text = new MarkdownTextConverter().Convert(markdown);
        var chunk = SpeechTextChunker.Split(text).Single();

        // Act
        var document = XElement.Parse(SpeechSsmlBuilder.Build(chunk, "en-AU-NatashaNeural"));

        // Assert
        var voice = document.Element(Synthesis + "voice")!;
        voice.Nodes().OfType<XText>().Select(node => node.Value)
            .ShouldBe(["Heading", "Body", "Subheading", "First", "Second"]);
        voice.Elements(Synthesis + "break").Count().ShouldBe(5);
        voice.Elements(Synthesis + "break").ShouldAllBe(element => (string?)element.Attribute("time") == "500ms");
    }

    [Test]
    public void Build_CodeBlock_PreservesCodeAndPausesBetweenLines()
    {
        // Arrange
        const string markdown = "```csharp\nif (count < 2 && ready)\n    Run();\n```";
        var text = new MarkdownTextConverter().Convert(markdown);
        var chunk = SpeechTextChunker.Split(text).Single();

        // Act
        var document = XElement.Parse(SpeechSsmlBuilder.Build(chunk, "en-AU-NatashaNeural"));

        // Assert
        var voice = document.Element(Synthesis + "voice")!;
        voice.Nodes().OfType<XText>().Select(node => node.Value)
            .ShouldBe(["if (count < 2 && ready)", "Run();"]);
        voice.Elements(Synthesis + "break").Count().ShouldBe(2);
    }

    [Test]
    public void Build_TextContainsXmlCharacters_EscapesContentInsteadOfInjectingMarkup()
    {
        // Arrange
        const string text = "A & B <break time=\"9s\"/>";

        // Act
        var document = XElement.Parse(SpeechSsmlBuilder.Build(new SpeechTextChunk(text, false), "en-AU-NatashaNeural"));

        // Assert
        document.Value.ShouldBe(text);
        document.Descendants(Synthesis + "break").ShouldBeEmpty();
    }

    [Test]
    public void Build_ParagraphSpansRequests_DoesNotAddStructuralPauseMidParagraph()
    {
        // Arrange
        var chunks = SpeechTextChunker.Split("Heading\n\nA longer paragraph", maximumChunkLength: 9);

        // Act
        var documents = chunks.Select(chunk => XElement.Parse(SpeechSsmlBuilder.Build(chunk, "en-AU-NatashaNeural"))).ToArray();

        // Assert
        documents[0].Descendants(Synthesis + "break").Count().ShouldBe(1);
        documents[1].Descendants(Synthesis + "break").ShouldBeEmpty();
        documents[^1].Descendants(Synthesis + "break").Count().ShouldBe(1);
    }
}
