using SmartDev.Shared.Infrastructure.Storage;
using SmartDev.Shared.Infrastructure.Text;
using Microsoft.Extensions.Logging.Abstractions;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Messaging;
using SmartDev.Worker.Functions.Application.Ports;
using SmartDev.Worker.Functions.Application.UsesCases;

namespace SmartDev.Tests.Worker.Articles;

[TestFixture]
public sealed class GenerateArticleNarrationHandlerTests
{
    [Test]
    public async Task HandleAsync_ValidRequest_UploadsSynthesizedNarration()
    {
        // Arrange
        var speechService = new RecordingSpeechService();
        var storage = new RecordingAudioStorage();
        var handler = new GenerateArticleNarrationHandler(
            new MarkdownTextConverter(),
            speechService,
            storage,
            NullLogger<GenerateArticleNarrationHandler>.Instance);
        var message = new ArticleNarrationRequestedIntegrationEvent(
            Guid.NewGuid(),
            "version-1",
            "Partition keys",
            "Storage and visibility are separate.",
            "Use `partitionKey` for storage.",
            DateTimeOffset.UtcNow);

        // Act
        await handler.HandleAsync(message, CancellationToken.None);

        // Assert
        speechService.Text.ShouldBe("""
            Partition keys

            Storage and visibility are separate.

            Use partitionKey for storage.
            """);
        storage.ContentId.ShouldBe(message.ArticleId);
        storage.ContentVersion.ShouldBe("version-1");
        storage.ContentType.ShouldBe("audio/mpeg");
        storage.AudioText.ShouldBe("audio bytes");
    }

    private sealed class RecordingSpeechService : IArticleSpeechService
    {
        public string? Text { get; private set; }

        public Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken)
        {
            Text = text;
            return Task.FromResult(new ArticleSpeechAudio(BinaryData.FromString("audio bytes"), "audio/mpeg"));
        }
    }

    private sealed class RecordingAudioStorage : IAudioStorage
    {
        public Guid ContentId { get; private set; }
        public string? ContentVersion { get; private set; }
        public string? ContentType { get; private set; }
        public string? AudioText { get; private set; }

        public async Task UploadAsync(Guid contentId, string contentVersion, Stream audio, string contentType, CancellationToken cancellationToken)
        {
            using var reader = new StreamReader(audio);
            ContentId = contentId;
            ContentVersion = contentVersion;
            ContentType = contentType;
            AudioText = await reader.ReadToEndAsync(cancellationToken);
        }

        public Task<AudioFile?> OpenReadAsync(Guid contentId, string contentVersion, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}

