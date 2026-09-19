namespace SmartDev.Shared.Options;

public sealed class ArticleAudioStorageOptions
{
    public const string SectionName = "ArticleAudioStorage";

    public string? ConnectionString { get; init; }

    public string ContainerName { get; init; } = "article-audio";

    public string BlobPrefix { get; init; } = "articles";
}
