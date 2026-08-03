using SmartDev.Api.Functions.Domain.Portfolio;

namespace SmartDev.Tests.Api.Portfolio;

[TestFixture]
public sealed class ProfessionalExperienceTests
{
    [Test]
    public void Create_ValidDetails_CreatesProfessionalExperience()
    {
        // Arrange
        var id = ProfessionalExperienceId.New();
        var skills = CreateSkills();

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
        Assert.That(experience.Id, Is.EqualTo(id));
        Assert.That(experience.CompanyName, Is.EqualTo("Contoso"));
        Assert.That(experience.RoleTitle, Is.EqualTo("Senior Engineer"));
        Assert.That(experience.ImagePath, Is.EqualTo("/images/contoso.png"));
        Assert.That(experience.RoleSummary, Is.EqualTo("Built production systems."));
        Assert.That(experience.KeyContributions, Is.EqualTo(new[] { "Improved deployment reliability", "Reduced lead time" }));
        Assert.That(experience.SkillsAndPractices, Is.EqualTo(skills));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_CompanyNameMissing_ThrowsArgumentException(string companyName)
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreateProfessionalExperience(companyName: companyName));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("companyName"));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_RoleTitleMissing_ThrowsArgumentException(string roleTitle)
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreateProfessionalExperience(roleTitle: roleTitle));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("roleTitle"));
    }

    [Test]
    public void Create_KeyContributionsEmpty_ThrowsArgumentException()
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreateProfessionalExperience(keyContributions: []));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("keyContributions"));
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Create_KeyContributionItemMissing_ThrowsArgumentException(string contribution)
    {
        // Act
        var exception = Assert.Throws<ArgumentException>(() => CreateProfessionalExperience(keyContributions: [contribution]));

        // Assert
        Assert.That(exception!.ParamName, Is.EqualTo("keyContributions"));
    }

    private static ProfessionalExperience CreateProfessionalExperience(
        string companyName = "Contoso",
        string roleTitle = "Senior Engineer",
        IEnumerable<string>? keyContributions = null)
    {
        return ProfessionalExperience.Create(
            id: ProfessionalExperienceId.New(),
            companyName: companyName,
            roleTitle: roleTitle,
            imagePath: "/images/contoso.png",
            roleSummary: "Built production systems.",
            keyContributions: keyContributions ?? ["Improved deployment reliability"],
            skillsAndPractices: CreateSkills());
    }

    private static ProfessionalSkills CreateSkills()
    {
        return ProfessionalSkills.Create(
            backend: ".NET",
            frontend: "React",
            cicdCloud: "Azure DevOps",
            engineeringPractices: "DDD and automated testing");
    }
}
