namespace SmartDev.Worker.Functions.Application.Ports;

public interface IArticleSpeechService
{
    Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken);
}

public sealed record ArticleSpeechAudio(BinaryData Audio, string ContentType);
