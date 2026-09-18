using System.Text;
using SmartDev.Worker.Functions.Application.Ports;

namespace SmartDev.Worker.Functions.Infrastructure.Speech;

public sealed class LocalArticleSpeechService : IArticleSpeechService
{
    public Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken)
    {
        var audio = BinaryData.FromBytes(Encoding.UTF8.GetBytes(text));
        return Task.FromResult(new ArticleSpeechAudio(audio, "text/plain; charset=utf-8"));
    }
}
