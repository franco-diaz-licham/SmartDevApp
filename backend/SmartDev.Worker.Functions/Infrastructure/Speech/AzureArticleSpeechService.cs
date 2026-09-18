using Microsoft.CognitiveServices.Speech;
using Microsoft.Extensions.Options;
using SmartDev.Worker.Functions.Application.Ports;
using SmartDev.Worker.Functions.Infrastructure.Options;

namespace SmartDev.Worker.Functions.Infrastructure.Speech;

public sealed class AzureArticleSpeechService(IOptions<AzureSpeechOptions> options) : IArticleSpeechService
{
    private const string ContentType = "audio/mpeg";

    public async Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken)
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

        return new ArticleSpeechAudio(BinaryData.FromBytes(result.AudioData), ContentType);
    }
}
