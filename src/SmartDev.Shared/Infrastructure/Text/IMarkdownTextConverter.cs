namespace SmartDev.Shared.Infrastructure.Text;

/// <summary>Produces plain narration text with blank lines marking pauses between readable blocks.</summary>
public interface IMarkdownTextConverter
{
    /// <summary>Preserves headings, paragraphs and list items as separate narration blocks.</summary>
    string Convert(string markdown);
}
