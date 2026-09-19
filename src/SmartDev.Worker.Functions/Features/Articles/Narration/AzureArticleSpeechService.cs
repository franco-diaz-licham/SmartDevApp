using Microsoft.CognitiveServices.Speech;
using Microsoft.Extensions.Options;
using SmartDev.Worker.Functions.Common.Application;

namespace SmartDev.Worker.Functions.Features.Articles.Narration;

public sealed class AzureArticleSpeechService(IOptions<AzureSpeechOptions> options) : IArticleSpeechService
{
    private const string ContentType = "audio/mpeg";

    public async Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken)
    {
        var chunks = SpeechTextChunker.Split(text);
        if (chunks.Count == 0) return new ArticleSpeechAudio(BinaryData.FromBytes([]), ContentType);

        await using var audio = new MemoryStream();
        foreach (var chunk in chunks) {
            var chunkAudio = await SynthesizeChunkAsync(chunk, cancellationToken);
            await audio.WriteAsync(chunkAudio, cancellationToken);
        }

        return new ArticleSpeechAudio(BinaryData.FromBytes(audio.ToArray()), ContentType);
    }

    private async Task<byte[]> SynthesizeChunkAsync(string text, CancellationToken cancellationToken)
    {
        var speechOptions = options.Value;
        var config = SpeechConfig.FromSubscription(speechOptions.SubscriptionKey, speechOptions.Region);
        config.SpeechSynthesisVoiceName = speechOptions.VoiceName;
        config.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3);

        using var synthesizer = new SpeechSynthesizer(config, audioConfig: null);
        using var result = await synthesizer.SpeakTextAsync(text).WaitAsync(cancellationToken);

        if (result.Reason != ResultReason.SynthesizingAudioCompleted) {
            var cancellation = SpeechSynthesisCancellationDetails.FromResult(result);
            throw new InvalidOperationException($"Azure Speech synthesis failed. Reason: {result.Reason}. Details: {cancellation.ErrorDetails}");
        }

        return result.AudioData;
    }
}
