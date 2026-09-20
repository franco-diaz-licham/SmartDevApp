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
    public void Convert_CodeBlocks_PreservesCodeWithPausesBetweenLines()
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

            UPDATE WarehouseStock

            SET Quantity = Quantity - 1

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

    [TestCase("#")]
    [TestCase("##")]
    [TestCase("###")]
    [TestCase("####")]
    [TestCase("#####")]
    [TestCase("######")]
    public void Convert_HeadingWithoutBlankLines_PreservesPausesBeforeAndAfter(string marker)
    {
        // Arrange
        var markdown = $"Before.\n{marker} **A heading** ###\nAfter.";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Before.\n\nA heading\n\nAfter.");
    }

    [TestCase("===")]
    [TestCase("---")]
    public void Convert_SetextHeading_ReadsTitleWithoutUnderline(string underline)
    {
        // Arrange
        var markdown = $"Section title\n{underline}\nParagraph.";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Section title\n\nParagraph.");
    }

    [Test]
    public void Convert_NestedAndTaskLists_PreservesItemOrderAndBoundaries()
    {
        // Arrange
        const string markdown = "- Parent\n  - Child\n- [x] Finished\n- [ ] Pending";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Parent\n\nChild\n\nFinished\n\nPending");
    }

    [Test]
    public void Convert_SoftAndHardLineBreaks_DistinguishesWrappingFromReadingBreaks()
    {
        // Arrange
        const string markdown = "A wrapped\nparagraph.  \nA new line.";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("A wrapped paragraph.\n\nA new line.");
    }

    [Test]
    public void Convert_ReferenceLinksAndNestedFormatting_ReadsVisibleLabelOnly()
    {
        // Arrange
        const string markdown = "Use [**the guide**][guide] &amp; `a_b`.\n\n[guide]: https://example.test/docs";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Use the guide & a_b.");
    }

    [Test]
    public void Convert_TableWithoutOuterPipes_OmitsTableAsOneBlock()
    {
        // Arrange
        const string markdown = "Name | Value\n--- | ---\nOne | Two";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Table omitted.");
    }

    [Test]
    public void Convert_UnclosedCodeFence_PreservesCodeToEndOfDocument()
    {
        // Arrange
        const string markdown = "Before.\n\n```csharp\nvar secret = 1;";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Before.\n\nvar secret = 1;");
    }

    [TestCase("    first();\n    second();")]
    [TestCase("~~~csharp\nfirst();\nsecond();\n~~~")]
    public void Convert_CodeBlockFormats_PreservesEachCodeLine(string markdown)
    {
        // Arrange
        var converter = new MarkdownTextConverter();

        // Act
        var text = converter.Convert(markdown);

        // Assert
        text.ShouldBe("first();\n\nsecond();");
    }

    [Test]
    public void Convert_CodeContainingHtmlAndMarkdown_PreservesLiteralContent()
    {
        // Arrange
        const string markdown = "```html\n<p>A &amp; B</p>\n<!-- Keep this comment -->\n# Not a heading\n```";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("<p>A &amp; B</p>\n\n<!-- Keep this comment -->\n\n# Not a heading");
    }

    [Test]
    public void Convert_InlineCodeContainingHtml_PreservesLiteralText()
    {
        // Arrange
        const string markdown = "Use `<p>A &amp; B</p>` literally.";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Use <p>A &amp; B</p> literally.");
    }

    [Test]
    public void Convert_LinkWithParenthesesAndNestedFormatting_ReadsLabelOnly()
    {
        // Arrange
        const string markdown = "Read [the **setup** guide](https://example.test/docs/setup(v2)).";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("Read the setup guide.");
    }

    [Test]
    public void Convert_LongerCodeFence_PreservesShorterFenceInsideExample()
    {
        // Arrange
        const string markdown = "````markdown\n# Example\n```\ntext\n```\n````";

        // Act
        var text = new MarkdownTextConverter().Convert(markdown);

        // Assert
        text.ShouldBe("# Example\n\n```\n\ntext\n\n```");
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
