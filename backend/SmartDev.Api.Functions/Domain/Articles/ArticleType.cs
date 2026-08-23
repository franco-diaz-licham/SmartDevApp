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
    /// A lightweight captured idea, reminder, snippet, or rough understanding.
    /// </summary>
    Note,

    /// <summary>
    /// A summary, takeaway, or reflection from a book or book chapter.
    /// </summary>
    BookSummary,

    /// <summary>
    /// A writeup explaining something built, including context, approach, tradeoffs, and outcome.
    /// </summary>
    ProjectWriteup,

    /// <summary>
    /// A problem investigation covering symptoms, root cause, fix, and lessons learned.
    /// </summary>
    DebuggingStory,

    /// <summary>
    /// A reflection on learning, building, reading, blockers, and next steps.
    /// </summary>
    Reflection,

    /// <summary>
    /// A small prototype, demo, technical exercise, or experiment writeup.
    /// </summary>
    Experiment
}
