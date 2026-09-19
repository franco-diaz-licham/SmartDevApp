namespace SmartDev.Shared.Messaging;

public sealed record ArticleNarrationRequestedIntegrationEvent(
    Guid ArticleId,
    string ContentVersion,
    string Title,
    string Summary,
    string BodyMarkdown,
    DateTimeOffset RequestedAt);
