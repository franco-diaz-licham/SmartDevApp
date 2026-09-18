using SmartDev.Worker.Functions.Application.Ports;

namespace SmartDev.Worker.Functions.Infrastructure.Speech;

public sealed class LocalArticleSpeechService : IArticleSpeechService
{
    private const string ContentType = "audio/wav";

    public Task<ArticleSpeechAudio> SynthesizeAsync(string text, CancellationToken cancellationToken)
    {
        return Task.FromResult(new ArticleSpeechAudio(BinaryData.FromBytes(CreateSilentWav()), ContentType));
    }

    private static byte[] CreateSilentWav()
    {
        const int sampleRate = 8000;
        const short bitsPerSample = 16;
        const short channels = 1;
        const int durationSeconds = 1;
        const short blockAlign = channels * bitsPerSample / 8;
        const int byteRate = sampleRate * blockAlign;
        const int dataLength = sampleRate * blockAlign * durationSeconds;
        const int fileLengthMinusRiffHeader = 36 + dataLength;

        var audio = new byte[44 + dataLength];
        WriteAscii(audio, 0, "RIFF");
        WriteInt32(audio, 4, fileLengthMinusRiffHeader);
        WriteAscii(audio, 8, "WAVE");
        WriteAscii(audio, 12, "fmt ");
        WriteInt32(audio, 16, 16);
        WriteInt16(audio, 20, 1);
        WriteInt16(audio, 22, channels);
        WriteInt32(audio, 24, sampleRate);
        WriteInt32(audio, 28, byteRate);
        WriteInt16(audio, 32, blockAlign);
        WriteInt16(audio, 34, bitsPerSample);
        WriteAscii(audio, 36, "data");
        WriteInt32(audio, 40, dataLength);

        return audio;
    }

    private static void WriteAscii(byte[] buffer, int offset, string value)
    {
        for (var index = 0; index < value.Length; index++) buffer[offset + index] = (byte)value[index];
    }

    private static void WriteInt16(byte[] buffer, int offset, short value)
    {
        buffer[offset] = (byte)value;
        buffer[offset + 1] = (byte)(value >> 8);
    }

    private static void WriteInt32(byte[] buffer, int offset, int value)
    {
        buffer[offset] = (byte)value;
        buffer[offset + 1] = (byte)(value >> 8);
        buffer[offset + 2] = (byte)(value >> 16);
        buffer[offset + 3] = (byte)(value >> 24);
    }
}