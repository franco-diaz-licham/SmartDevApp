using SmartDev.Api.Functions.Domain.Content;
using SmartDev.Api.Functions.Domain.Portfolio;

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
        Assert.That(websiteContent.Id, Is.EqualTo(id));
        Assert.That(websiteContent.PersonalProjects, Is.EqualTo(new[] { personalProject }));
        Assert.That(websiteContent.ProfessionalExperiences, Is.EqualTo(new[] { professionalExperience }));
        Assert.That(websiteContent.UpdatedAt, Is.EqualTo(updatedAt));
    }

    [Test]
    public void Create_PersonalProjectsEmpty_ThrowsArgumentException()
    {
        // Arrange
        var professionalExperience = CreateProfessionalExperience("Contoso");

        // Act
        var exception = Assert.Throws<ArgumentException>(() => WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: [],
            professionalExperiences: [professionalExperience],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("personalProjects"));
    }

    [Test]
    public void Create_ProfessionalExperiencesEmpty_ThrowsArgumentException()
    {
        // Arrange
        var personalProject = CreatePersonalProject("SmartDev Portfolio");

        // Act
        var exception = Assert.Throws<ArgumentException>(() => WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: [personalProject],
            professionalExperiences: [],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("professionalExperiences"));
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
        Assert.That(websiteContent.PersonalProjects, Is.EqualTo(new[] { newPersonalProject }));
        Assert.That(websiteContent.ProfessionalExperiences, Is.EqualTo(new[] { newProfessionalExperience }));
        Assert.That(websiteContent.UpdatedAt, Is.EqualTo(updatedAt));
    }

    [Test]
    public void ReplaceContent_PersonalProjectsEmpty_ThrowsArgumentException()
    {
        // Arrange
        var websiteContent = CreateWebsiteContent();

        // Act
        var exception = Assert.Throws<ArgumentException>(() => websiteContent.ReplaceContent(
            personalProjects: [],
            professionalExperiences: [CreateProfessionalExperience("Contoso")],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("personalProjects"));
    }

    [Test]
    public void ReplaceContent_ProfessionalExperiencesEmpty_ThrowsArgumentException()
    {
        // Arrange
        var websiteContent = CreateWebsiteContent();

        // Act
        var exception = Assert.Throws<ArgumentException>(() => websiteContent.ReplaceContent(
            personalProjects: [CreatePersonalProject("SmartDev Portfolio")],
            professionalExperiences: [],
            updatedAt: DateTimeOffset.UtcNow));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("professionalExperiences"));
    }

    private static WebsiteContent CreateWebsiteContent()
    {
        return WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: [CreatePersonalProject("SmartDev Portfolio")],
            professionalExperiences: [CreateProfessionalExperience("Contoso")],
            updatedAt: DateTimeOffset.UtcNow);
    }

    private static PersonalProject CreatePersonalProject(string projectName)
    {
        return PersonalProject.Create(
            id: PersonalProjectId.New(),
            projectName: projectName,
            subtitle: "Production portfolio",
            imagePath: "/images/portfolio.png",
            demoUrl: "https://example.com",
            overview: "A portfolio with a contact workflow.",
            impact: ["Clearer client enquiry flow"],
            technology: ProjectTechnologyProfile.Create(
                backend: ".NET Azure Functions",
                frontend: "React",
                cicdCloud: "Azure Static Web Apps",
                architecture: "Clean architecture"));
    }

    private static ProfessionalExperience CreateProfessionalExperience(string companyName)
    {
        return ProfessionalExperience.Create(
            id: ProfessionalExperienceId.New(),
            companyName: companyName,
            roleTitle: "Senior Engineer",
            imagePath: "/images/contoso.png",
            roleSummary: "Built production systems.",
            keyContributions: ["Improved deployment reliability"],
            skillsAndPractices: ProfessionalSkills.Create(
                backend: ".NET",
                frontend: "React",
                cicdCloud: "Azure DevOps",
                engineeringPractices: "DDD and automated testing"));
    }
}
