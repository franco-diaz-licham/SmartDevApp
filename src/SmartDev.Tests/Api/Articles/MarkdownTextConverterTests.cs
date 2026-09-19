using SmartDev.Shared.Infrastructure.Text;
using SmartDev.Shared.Articles;

namespace SmartDev.Tests.Api.Articles;

[TestFixture]
public sealed class MarkdownTextConverterTests
{
    [Test]
    public void Convert_ArticleMarkdown_ReturnsSpeechFriendlyText()
    {
        // Arrange
        const string markdown = """
            # Partition keys

            Use `partitionKey` instead of `/visibility`.

            - Articles use **articles**
            - Contact messages use [contact-messages](/contact)

            ![Architecture diagram](/diagram.png)
            """;
        var converter = new MarkdownTextConverter();

        // Act
        var text = converter.Convert(markdown);

        // Assert
        text.ReplaceLineEndings("\n").ShouldBe("""
            Partition keys

            Use partitionKey instead of /visibility.

            Articles use articles
            Contact messages use contact-messages
            """.ReplaceLineEndings("\n"));
    }

    [Test]
    public void Convert_CodeBlocks_ReplacesCodeWithOmittedMessage()
    {
        // Arrange
        const string markdown = """
            ## Optimistic concurrency

            Optimistic concurrency assumes conflicts are uncommon.

            ```sql
            UPDATE WarehouseStock
            SET Quantity = Quantity - 1
            ```

            Continue after the example.
            """;
        var converter = new MarkdownTextConverter();

        // Act
        var text = converter.Convert(markdown);

        // Assert
        text.ReplaceLineEndings("\n").ShouldBe("""
            Optimistic concurrency

            Optimistic concurrency assumes conflicts are uncommon.

            Code example omitted.

            Continue after the example.
            """.ReplaceLineEndings("\n"));
    }

    [Test]
    public void Convert_TablesAndHtml_ReturnsReadableNarration()
    {
        // Arrange
        const string markdown = """
            > Deployment options

            | Option | Result |
            | --- | --- |
            | API | Streams audio |
            | SAS | Blob serves audio |

            <p>Prefer <strong>SAS</strong> URLs &amp; short expiries.</p>
            """;
        var converter = new MarkdownTextConverter();

        // Act
        var text = converter.Convert(markdown);

        // Assert
        text.ReplaceLineEndings("\n").ShouldBe("""
            Deployment options

            Table omitted.

            Prefer SAS URLs & short expiries.
            """.ReplaceLineEndings("\n"));
    }

    [Test]
    public void Convert_BlankMarkdown_ReturnsEmptyString()
    {
        // Arrange
        var converter = new MarkdownTextConverter();

        // Act
        var text = converter.Convert("   ");

        // Assert
        text.ShouldBeEmpty();
    }
}
