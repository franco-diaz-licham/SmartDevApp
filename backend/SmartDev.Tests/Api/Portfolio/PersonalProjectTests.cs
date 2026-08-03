using SmartDev.Api.Functions.Domain.Portfolio;

namespace SmartDev.Tests.Api.Portfolio;

[TestFixture]
public sealed class PersonalProjectTests
{
    [Test]
    public void Create_ValidDetails_CreatesPersonalProject()
    {
        // Arrange
        var id = PersonalProjectId.New();
        var technology = CreateTechnologyProfile();

        // Act
        var project = PersonalProject.Create(
            id: id,
            projectName: "  SmartDev Portfolio  ",
            subtitle: "  Production portfolio  ",
            imagePath: "  /images/portfolio.png  ",
            demoUrl: "  https://example.com  ",
            overview: "  A portfolio with a contact workflow.  ",
            impact: ["  Clearer client enquiry flow  ", "Cloud-hosted deployment"],
            technology: technology);

        // Assert
        Assert.That(project.Id, Is.EqualTo(id));
        Assert.That(project.ProjectName, Is.EqualTo("SmartDev Portfolio"));
        Assert.That(project.Subtitle, Is.EqualTo("Production portfolio"));
        Assert.That(project.ImagePath, Is.EqualTo("/images/portfolio.png"));
        Assert.That(project.DemoUrl, Is.EqualTo("https://example.com"));
        Assert.That(project.Overview, Is.EqualTo("A portfolio with a contact workflow."));
        Assert.That(project.Impact, Is.EqualTo(new[] { "Clearer client enquiry flow", "Cloud-hosted deployment" }));
        Assert.That(project.Technology, Is.EqualTo(technology));
    }

    [Test]
    public void Create_DemoUrlBlank_CreatesProjectWithoutDemoUrl()
    {
        // Arrange
        var id = PersonalProjectId.New();

        // Act
        var project = CreatePersonalProject(id: id, demoUrl: "   ");

        // Assert
        Assert.That(project.DemoUrl, Is.Null);
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_ProjectNameMissing_ThrowsArgumentException(string projectName)
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreatePersonalProject(projectName: projectName));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("projectName"));
    }

    [Test]
    public void Create_ImpactEmpty_ThrowsArgumentException()
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreatePersonalProject(impact: []));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("impact"));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_ImpactItemMissing_ThrowsArgumentException(string impactItem)
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreatePersonalProject(impact: [impactItem]));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("impact"));
    }

    private static PersonalProject CreatePersonalProject(
        PersonalProjectId? id = null,
        string projectName = "SmartDev Portfolio",
        string demoUrl = "https://example.com",
        IEnumerable<string>? impact = null)
    {
        return PersonalProject.Create(
            id: id ?? PersonalProjectId.New(),
            projectName: projectName,
            subtitle: "Production portfolio",
            imagePath: "/images/portfolio.png",
            demoUrl: demoUrl,
            overview: "A portfolio with a contact workflow.",
            impact: impact ?? ["Clearer client enquiry flow"],
            technology: CreateTechnologyProfile());
    }

    private static ProjectTechnologyProfile CreateTechnologyProfile()
    {
        return ProjectTechnologyProfile.Create(
            backend: ".NET Azure Functions",
            frontend: "React",
            cicdCloud: "Azure Static Web Apps",
            architecture: "Clean architecture");
    }
}
