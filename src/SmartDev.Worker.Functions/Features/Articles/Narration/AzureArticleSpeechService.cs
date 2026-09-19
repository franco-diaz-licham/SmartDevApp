using Microsoft.CognitiveServices.Speech;
using Microsoft.Extensions.Options;
using SmartDev.Worker.Functions.Common.Application;

namespace SmartDev.Worker.Functions.Features.Articles.Narration;

public sealed class AzureArticleSpeechService(IOptions<AzureSpeechOptions> options) : IArticleSpeechService
{
    private const string ContentType = "audio/mpeg";

    /// <summary>
    /// Allows the Speech SDK to wait longer between synthesized audio frames before treating synthesis as stalled.
    /// The default SDK threshold is too low for longer article narration on serverless workers.
    /// </summary>
    private const string FrameTimeoutIntervalMilliseconds = "60000";

    /// <summary>
    /// Allows synthesis to run up to twenty times slower than the generated audio duration before timing out.
    /// This protects longer article narration from transient Speech service slowness while still bounding retries.
    /// </summary>
    private const string RtfTimeoutThreshold = "20";

    public async Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken)
    {
        var speechOptions = options.Value;
        var config = SpeechConfig.FromSubscription(speechOptions.SubscriptionKey, speechOptions.Region);
        config.SpeechSynthesisVoiceName = speechOptions.VoiceName;
        config.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3);
        config.SetProperty(PropertyId.SpeechSynthesis_FrameTimeoutInterval, FrameTimeoutIntervalMilliseconds);
        config.SetProperty(PropertyId.SpeechSynthesis_RtfTimeoutThreshold, RtfTimeoutThreshold);

        using var synthesizer = new SpeechSynthesizer(config, audioConfig: null);
        using var result = await synthesizer.SpeakTextAsync(text).WaitAsync(cancellationToken);

        if (result.Reason != ResultReason.SynthesizingAudioCompleted) {
            var cancellation = SpeechSynthesisCancellationDetails.FromResult(result);
            throw new InvalidOperationException($"Azure Speech synthesis failed. Reason: {result.Reason}. Details: {cancellation.ErrorDetails}");
        }

        return new ArticleSpeechAudio(BinaryData.FromBytes(result.AudioData), ContentType);
    }
}
