namespace SmartDev.Api.Functions.Features.Journal.Domain;

/// <summary>
/// Describes the intended shape of a journal entry.
/// </summary>
public enum JournalEntryType
{
    Note,
    DailyNote,
    ImplementationPlan,
    Decision,
    DebuggingLog,
    LearningNote,
    Retrospective,
    ReleaseNote
}

/// <summary>
/// Tracks the personal workflow state for a journal entry.
/// </summary>
public enum JournalEntryStatus
{
    Active,
    Blocked,
    Resolved,
    Deferred,
    Archived
}

/// <summary>
/// Captures how settled the entry's information is.
/// </summary>
public enum JournalConfidence
{
    Confirmed,
    Tentative,
    NeedsFollowUp
}
