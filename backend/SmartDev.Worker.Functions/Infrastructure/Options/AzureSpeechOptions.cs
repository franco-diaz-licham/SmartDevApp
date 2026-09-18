using System.ComponentModel.DataAnnotations;

namespace SmartDev.Worker.Functions.Infrastructure.Options;

public sealed class AzureSpeechOptions
{
    public const string SectionName = "AzureSpeech";

    [Required]
    public string SubscriptionKey { get; init; } = string.Empty;

    [Required]
    public string Region { get; init; } = string.Empty;

    [Required]
    public string VoiceName { get; init; } = "en-AU-NatashaNeural";
}