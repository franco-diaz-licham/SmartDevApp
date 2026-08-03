using SmartDev.Api.Functions.Domain.Content;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Content;

[TestFixture]
public sealed class WebsiteContentTests
{
    [Test]
    public void Create_ValidContent_CreatesWebsiteContent()
    {
        // Arrange
        var id = WebsiteContentId.New();
        var personalProject = CreatePersonalProject("SmartDev Portfolio");
        var professionalExperience = CreateProfessionalExperience("Contoso");
        var updatedAt = new DateTimeOffset(2026, 8, 3, 12, 0, 0, TimeSpan.Zero);

        // Act
        var websiteContent = WebsiteContent.Create(
            id: id,
            personalProjects: [personalProject],
            professionalExperiences: [professionalExperience],
            updatedAt: updatedAt);

        // Assert
        websiteContent.Id.ShouldBe(id);
        websiteContent.PersonalProjects.ShouldBe([personalProject]);
        websiteContent.ProfessionalExperiences.ShouldBe([professionalExperience]);
        websiteContent.UpdatedAt.ShouldBe(updatedAt);
    }

    [Test]
    public void Create_PersonalProjectsEmpty_ThrowsArgumentException()
    {
        // Arrange
        var professionalExperience = CreateProfessionalExperience("Contoso");

        // Act
        var exception = Should.Throw<ArgumentException>(() => WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: [],
            professionalExperiences: [professionalExperience],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        exception.ParamName.ShouldBe("personalProjects");
    }

    [Test]
    public void Create_ProfessionalExperiencesEmpty_ThrowsArgumentException()
    {
        // Arrange
        var personalProject = CreatePersonalProject("SmartDev Portfolio");

        // Act
        var exception = Should.Throw<ArgumentException>(() => WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: [personalProject],
            professionalExperiences: [],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        exception.ParamName.ShouldBe("professionalExperiences");
    }

    [Test]
    public void ReplaceContent_ValidContent_ReplacesOwnedCollectionsAndUpdatedAt()
    {
        // Arrange
        var websiteContent = WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: [CreatePersonalProject("Legacy Portfolio")],
            professionalExperiences: [CreateProfessionalExperience("Fabrikam")],
            updatedAt: new DateTimeOffset(2026, 8, 1, 12, 0, 0, TimeSpan.Zero));

        var newPersonalProject = CreatePersonalProject("SmartDev Portfolio");
        var newProfessionalExperience = CreateProfessionalExperience("Contoso");
        var updatedAt = new DateTimeOffset(2026, 8, 3, 12, 0, 0, TimeSpan.Zero);

        // Act
        websiteContent.ReplaceContent(
            personalProjects: [newPersonalProject],
            professionalExperiences: [newProfessionalExperience],
            updatedAt: updatedAt);

        // Assert
        websiteContent.PersonalProjects.ShouldBe([newPersonalProject]);
        websiteContent.ProfessionalExperiences.ShouldBe([newProfessionalExperience]);
        websiteContent.UpdatedAt.ShouldBe(updatedAt);
    }

    [Test]
    public void ReplaceContent_PersonalProjectsEmpty_ThrowsArgumentException()
    {
        // Arrange
        var websiteContent = CreateWebsiteContent();

        // Act
        var exception = Should.Throw<ArgumentException>(() => websiteContent.ReplaceContent(
            personalProjects: [],
            professionalExperiences: [CreateProfessionalExperience("Contoso")],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        exception.ParamName.ShouldBe("personalProjects");
    }

    [Test]
    public void ReplaceContent_ProfessionalExperiencesEmpty_ThrowsArgumentException()
    {
        // Arrange
        var websiteContent = CreateWebsiteContent();

        // Act
        var exception = Should.Throw<ArgumentException>(() => websiteContent.ReplaceContent(
            personalProjects: [CreatePersonalProject("SmartDev Portfolio")],
            professionalExperiences: [],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        exception.ParamName.ShouldBe("professionalExperiences");
    }
}
