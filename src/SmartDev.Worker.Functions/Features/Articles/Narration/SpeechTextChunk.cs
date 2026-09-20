namespace SmartDev.Worker.Functions.Features.Articles.Narration;

/// <summary>A bounded speech request; PauseAfter retains a block boundary at the end of a request.</summary>
internal sealed record SpeechTextChunk(string Text, bool PauseAfter);
