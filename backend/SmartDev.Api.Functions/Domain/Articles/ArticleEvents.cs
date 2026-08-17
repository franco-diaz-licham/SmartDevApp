using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Raised when an article draft is created.
/// </summary>
/// <param name="ArticleId">The created article identifier.</param>
/// <param name="OccurredAt">The time the article was created.</param>
public sealed record ArticleCreatedEvent(ArticleId ArticleId, DateTimeOffset OccurredAt) : IDomainEvent;

/// <summary>
/// Raised when editable article content, metadata, or links change.
/// </summary>
/// <param name="ArticleId">The updated article identifier.</param>
/// <param name="OccurredAt">The time the article was updated.</param>
public sealed record ArticleUpdatedEvent(ArticleId ArticleId, DateTimeOffset OccurredAt) : IDomainEvent;

/// <summary>
/// Raised when an article enters the published lifecycle state.
/// </summary>
/// <param name="ArticleId">The published article identifier.</param>
/// <param name="OccurredAt">The time the article was published.</param>
public sealed record ArticlePublishedEvent(ArticleId ArticleId, DateTimeOffset OccurredAt) : IDomainEvent;

/// <summary>
/// Raised when an article enters the archived lifecycle state.
/// </summary>
/// <param name="ArticleId">The archived article identifier.</param>
/// <param name="OccurredAt">The time the article was archived.</param>
public sealed record ArticleArchivedEvent(ArticleId ArticleId, DateTimeOffset OccurredAt) : IDomainEvent;
