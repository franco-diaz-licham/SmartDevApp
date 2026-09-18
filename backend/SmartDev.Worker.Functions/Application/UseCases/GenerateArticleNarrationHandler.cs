using Microsoft.Extensions.Logging;
using SmartDev.Shared.Articles;
using SmartDev.Shared.Infrastructure.Storage;
using SmartDev.Shared.Infrastructure.Text;
using SmartDev.Shared.Messaging;
using SmartDev.Worker.Functions.Application.Ports;

namespace SmartDev.Worker.Functions.Application.UsesCases;

public sealed class GenerateArticleNarrationHandler(
    IMarkdownTextConverter narrationTextConverter,
    IArticleSpeechService articleSpeechService,
    IAudioStorage articleAudioStorage,
    ILogger<GenerateArticleNarrationHandler> logger)
{
    public async Task HandleAsync(ArticleNarrationRequestedIntegrationEvent message, CancellationToken cancellationToken)
    {
        var narrationMarkdown = ArticleNarrationContent.CreateNarrationMarkdown(message.Title, message.Summary, message.BodyMarkdown);
        var narrationText = narrationTextConverter.Convert(narrationMarkdown);

        if (string.IsNullOrWhiteSpace(narrationText)) {
            logger.LogWarning("Article narration request skipped because the narration text was empty. ArticleId: {ArticleId}.", message.ArticleId);
            return;
        }

        var speechAudio = await articleSpeechService.SynthesizeAsync(narrationText, cancellationToken);
        await using var stream = speechAudio.Audio.ToStream();

        await articleAudioStorage.UploadAsync(
            message.ArticleId,
            message.ContentVersion,
            stream,
            speechAudio.ContentType,
            cancellationToken);

        logger.LogInformation(
            "Article narration generated. ArticleId: {ArticleId}. ContentVersion: {ContentVersion}.",
            message.ArticleId,
            message.ContentVersion);
    }
}
