using SmartDev.Api.Functions.Features.Articles.Domain;
using SmartDev.Api.Functions.Features.Journal.Domain;

namespace SmartDev.Tests.Api.Journal;

[TestFixture]
public sealed class JournalEntryTests
{
    [Test]
    public void Create_RequiredFieldsOnly_CreatesActiveNote()
    {
        // Arrange
        var now = new DateTimeOffset(2026, 9, 20, 9, 0, 0, TimeSpan.Zero);
        var occurredOn = new DateOnly(2026, 9, 20);

        // Act
        var entry = JournalEntry.Create(
            JournalEntryId.New(),
            JournalTitle.Create("First workplace note"),
            MarkdownContent.Create("Captured a quick note."),
            JournalEntryType.Note,
            JournalEntryStatus.Active,
            tags: [],
            summary: null,
            company: null,
            workplaceContext: null,
            outcome: null,
            impact: null,
            collaborators: [],
            JournalConfidence.Confirmed,
            relatedArticles: [],
            decisions: [],
            blockers: [],
            nextActions: [],
            occurredOn,
            now);

        // Assert
        entry.Title.Value.ShouldBe("First workplace note");
        entry.Body.Value.ShouldBe("Captured a quick note.");
        entry.EntryType.ShouldBe(JournalEntryType.Note);
        entry.Status.ShouldBe(JournalEntryStatus.Active);
        entry.Confidence.ShouldBe(JournalConfidence.Confirmed);
        entry.OccurredOn.ShouldBe(occurredOn);
        entry.CreatedAt.ShouldBe(now);
        entry.UpdatedAt.ShouldBeNull();
        entry.Tags.ShouldBeEmpty();
        entry.Company.ShouldBeNull();
        entry.WorkplaceContext.ShouldBeNull();
    }

    [Test]
    public void Create_DuplicateTagsAndCollaborators_NormalizesCollections()
    {
        // Arrange
        var tag = ArticleTagSnapshot.Create(ArticleTagSlug.Create("backend"), "Backend");
        var duplicateTag = ArticleTagSnapshot.Create(ArticleTagSlug.Create("backend"), "Backend");

        // Act
        var entry = JournalEntry.Create(
            JournalEntryId.New(),
            JournalTitle.Create("Pairing note"),
            MarkdownContent.Create("Reviewed retry behavior."),
            JournalEntryType.Note,
            JournalEntryStatus.Active,
            [tag, duplicateTag],
            summary: null,
            company: null,
            workplaceContext: null,
            outcome: null,
            impact: null,
            [CollaboratorReference.Create("Sam"), CollaboratorReference.Create("sam")],
            JournalConfidence.Confirmed,
            relatedArticles: [],
            decisions: [],
            blockers: [],
            nextActions: [],
            new DateOnly(2026, 9, 20));

        // Assert
        entry.Tags.Count.ShouldBe(1);
        entry.Collaborators.Count.ShouldBe(1);
    }

    [Test]
    public void Update_NewValues_UpdatesEntryAndArchivedState()
    {
        // Arrange
        var entry = JournalEntry.Create(
            JournalEntryId.New(),
            JournalTitle.Create("Initial note"),
            MarkdownContent.Create("Initial body."),
            JournalEntryType.Note,
            JournalEntryStatus.Active,
            tags: [],
            summary: null,
            company: null,
            workplaceContext: null,
            outcome: null,
            impact: null,
            collaborators: [],
            JournalConfidence.Tentative,
            relatedArticles: [],
            decisions: [],
            blockers: [],
            nextActions: [],
            new DateOnly(2026, 9, 19));
        var updatedAt = new DateTimeOffset(2026, 9, 20, 10, 0, 0, TimeSpan.Zero);

        // Act
        entry.Update(
            JournalTitle.Create("Updated note"),
            MarkdownContent.Create("Updated body."),
            JournalEntryType.Decision,
            JournalEntryStatus.Archived,
            [ArticleTagSnapshot.Create(ArticleTagSlug.Create("architecture"), "Architecture")],
            JournalSummary.CreateOptional("Updated summary."),
            CompanyReference.CreateOptional("Example Co", "Senior Engineer"),
            "Payments",
            WorkOutcome.CreateOptional("Decided retry policy"),
            WorkImpact.CreateOptional("Reduced operational ambiguity."),
            [CollaboratorReference.Create("Alex")],
            JournalConfidence.Confirmed,
            relatedArticles: [],
            [DecisionNote.Create("Keep retries bounded.")],
            blockers: [],
            [NextAction.Create("Document retry policy.")],
            new DateOnly(2026, 9, 20),
            updatedAt);

        // Assert
        entry.Title.Value.ShouldBe("Updated note");
        entry.EntryType.ShouldBe(JournalEntryType.Decision);
        entry.Status.ShouldBe(JournalEntryStatus.Archived);
        entry.ArchivedAt.ShouldBe(updatedAt);
        entry.UpdatedAt.ShouldBe(updatedAt);
        entry.Company?.Name.ShouldBe("Example Co");
        entry.WorkplaceContext.ShouldBe("Payments");
        entry.Decisions.Single().Value.ShouldBe("Keep retries bounded.");
        entry.NextActions.Single().Value.ShouldBe("Document retry policy.");
    }
}
