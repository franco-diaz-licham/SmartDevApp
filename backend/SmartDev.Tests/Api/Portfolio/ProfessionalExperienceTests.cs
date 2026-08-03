using SmartDev.Api.Functions.Domain.Portfolio;
using static SmartDev.Tests.TestData.AggregateTestData;

namespace SmartDev.Tests.Api.Portfolio;

[TestFixture]
public sealed class ProfessionalExperienceTests
{
    [Test]
    public void Create_ValidDetails_CreatesProfessionalExperience()
    {
        // Arrange
        var id = ProfessionalExperienceId.New();
        var skills = CreateProfessionalSkills();

        // Act
        var experience = ProfessionalExperience.Create(
            id: id,
            companyName: "  Contoso  ",
            roleTitle: "  Senior Engineer  ",
            imagePath: "  /images/contoso.png  ",
            roleSummary: "  Built production systems.  ",
            keyContributions: ["  Improved deployment reliability  ", "Reduced lead time"],
            skillsAndPractices: skills);

        // Assert
        experience.Id.ShouldBe(id);
        experience.CompanyName.ShouldBe("Contoso");
        experience.RoleTitle.ShouldBe("Senior Engineer");
        experience.ImagePath.ShouldBe("/images/contoso.png");
        experience.RoleSummary.ShouldBe("Built production systems.");
        experience.KeyContributions.ShouldBe(["Improved deployment reliability", "Reduced lead time"]);
        experience.SkillsAndPractices.ShouldBe(skills);
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_CompanyNameMissing_ThrowsArgumentException(string companyName)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateProfessionalExperience(companyName: companyName));

        // Assert
        exception.ParamName.ShouldBe("companyName");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_RoleTitleMissing_ThrowsArgumentException(string roleTitle)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateProfessionalExperience(roleTitle: roleTitle));

        // Assert
        exception.ParamName.ShouldBe("roleTitle");
    }

    [Test]
    public void Create_KeyContributionsEmpty_ThrowsArgumentException()
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateProfessionalExperience(keyContributions: []));

        // Assert
        exception.ParamName.ShouldBe("keyContributions");
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_KeyContributionItemMissing_ThrowsArgumentException(string contribution)
    {
        // Act
        var exception = Should.Throw<ArgumentException>(() => CreateProfessionalExperience(keyContributions: [contribution]));

        // Assert
        exception.ParamName.ShouldBe("keyContributions");
    }
}
