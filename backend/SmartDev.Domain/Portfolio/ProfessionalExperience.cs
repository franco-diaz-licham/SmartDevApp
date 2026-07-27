using SmartDev.Domain.Common;

namespace SmartDev.Domain.Portfolio;

public sealed class ProfessionalExperience : Entity<ProfessionalExperienceId>
{
    private ProfessionalExperience(
        ProfessionalExperienceId id,
        string companyName,
        string roleTitle,
        string imagePath,
        string roleSummary,
        IReadOnlyList<string> keyContributions,
        ProfessionalSkills skillsAndPractices)
        : base(id)
    {
        CompanyName = companyName;
        RoleTitle = roleTitle;
        ImagePath = imagePath;
        RoleSummary = roleSummary;
        KeyContributions = keyContributions;
        SkillsAndPractices = skillsAndPractices;
    }

    public string CompanyName { get; private set; }

    public string RoleTitle { get; private set; }

    public string ImagePath { get; private set; }

    public string RoleSummary { get; private set; }

    public IReadOnlyList<string> KeyContributions { get; private set; }

    public ProfessionalSkills SkillsAndPractices { get; private set; }

    public static ProfessionalExperience Create(
        ProfessionalExperienceId id,
        string companyName,
        string roleTitle,
        string imagePath,
        string roleSummary,
        IEnumerable<string> keyContributions,
        ProfessionalSkills skillsAndPractices)
    {
        return new ProfessionalExperience(
            id,
            Guard.Required(companyName, nameof(companyName), 160),
            Guard.Required(roleTitle, nameof(roleTitle), 160),
            Guard.Required(imagePath, nameof(imagePath), 500),
            Guard.Required(roleSummary, nameof(roleSummary), 5000),
            Guard.RequiredList(keyContributions, nameof(keyContributions), 1000),
            skillsAndPractices);
    }
}
