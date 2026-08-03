using SmartDev.Api.Functions.Domain.Portfolio;
using static SmartDev.Tests.TestData.AggregateTestData;

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
        project.Id.ShouldBe(id);
        project.ProjectName.ShouldBe("SmartDev Portfolio");
        project.Subtitle.ShouldBe("Production portfolio");
        project.ImagePath.ShouldBe("/images/portfolio.png");
        project.DemoUrl.ShouldBe("https://example.com");
        project.Overview.ShouldBe("A portfolio with a contact workflow.");
        project.Impact.ShouldBe(["Clearer client enquiry flow", "Cloud-hosted deployment"]);
        project.Technology.ShouldBe(technology);
    }

    [Test]
    public void Create_DemoUrlBlank_CreatesProjectWithoutDemoUrl()
    {
        // Arrange
        var id = PersonalProjectId.New();

        // Act
        var project = CreatePersonalProject(id: id, demoUrl: "   ");

        // Assert
        project.DemoUrl.ShouldBeNull();
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_ProjectNameMissing_ThrowsArgumentException(string projectName)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreatePersonalProject(projectName: projectName));

        // Assert
        exception.ParamName.ShouldBe("projectName");
    }

    [Test]
    public void Create_ImpactEmpty_ThrowsArgumentException()
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreatePersonalProject(impact: []));

        // Assert
        exception.ParamName.ShouldBe("impact");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_ImpactItemMissing_ThrowsArgumentException(string impactItem)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreatePersonalProject(impact: [impactItem]));

        // Assert
        exception.ParamName.ShouldBe("impact");
    }
}
