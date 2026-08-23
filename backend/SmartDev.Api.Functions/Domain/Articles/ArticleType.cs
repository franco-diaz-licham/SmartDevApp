namespace SmartDev.Api.Functions.Domain.Articles;

/// <summary>
/// Classifies the intent and shape of an article.
/// </summary>
public enum ArticleType
{
    /// <summary>
    /// A structured explanation of a technical topic, concept, or system.
    /// </summary>
    DeepDive,

    /// <summary>
    /// A summary, takeaway, or reflection from a book or book chapter.
    /// </summary>
    BookSummary,

    /// <summary>
    /// A writeup explaining something built, including context, approach, tradeoffs, and outcome.
    /// </summary>
    ProjectWriteup,

    /// <summary>
    /// A reflection on learning, building, reading, blockers, and next steps.
    /// </summary>
    Reflection
}
