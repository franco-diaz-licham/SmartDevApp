using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using SmartDev.Shared.Options;

namespace SmartDev.Shared.Infrastructure.Storage;

public sealed class BlobStorage(BlobContainerClient containerClient, ArticleAudioStorageOptions options) : IAudioStorage
{
    public const string DefaultContainerName = "article-audio";
    public const string DefaultBlobPrefix = "articles";

    private const string AudioFileName = "narration.mp3";
    private readonly string blobPrefix = string.IsNullOrWhiteSpace(options.BlobPrefix) ? DefaultBlobPrefix : options.BlobPrefix;

    public async Task UploadAsync(
        Guid contentId,
        string contentVersion,
        Stream audio,
        string contentType,
        CancellationToken cancellationToken)
    {
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.None, cancellationToken: cancellationToken);

        var blob = containerClient.GetBlobClient(CreateBlobName(contentId, contentVersion));
        await blob.UploadAsync(
            audio,
            new BlobUploadOptions {
                HttpHeaders = new BlobHttpHeaders {
                    ContentType = contentType
                }
            },
            cancellationToken);
    }

    public async Task<AudioFile?> OpenReadAsync(Guid contentId, string contentVersion, CancellationToken cancellationToken)
    {
        var blob = containerClient.GetBlobClient(CreateBlobName(contentId, contentVersion));

        try {
            var response = await blob.DownloadStreamingAsync(cancellationToken: cancellationToken);
            return new AudioFile(
                response.Value.Content,
                string.IsNullOrWhiteSpace(response.Value.Details.ContentType) ? "audio/mpeg" : response.Value.Details.ContentType);
        } catch (RequestFailedException exception) when (exception.Status == 404) {
            return null;
        }
    }

    private string CreateBlobName(Guid contentId, string contentVersion)
    {
        var normalizedPrefix = blobPrefix.Trim('/');
        return string.IsNullOrWhiteSpace(normalizedPrefix)
            ? $"{contentId:D}/{contentVersion}/{AudioFileName}"
            : $"{normalizedPrefix}/{contentId:D}/{contentVersion}/{AudioFileName}";
    }
}