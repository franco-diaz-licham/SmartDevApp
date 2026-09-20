namespace SmartDev.Shared.Infrastructure.Storage;

public interface IFileStorage
{
    Task UploadAsync(
        Guid contentId,
        string contentVersion,
        Stream audio,
        string contentType,
        CancellationToken cancellationToken);

    Task<AudioFile?> OpenReadAsync(
        Guid contentId,
        string contentVersion,
        CancellationToken cancellationToken);
}

public sealed record AudioFile(Stream Content, string ContentType);
