using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Portfolio;

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

    /// <summary>
    /// Gets the company or organisation name.
    /// </summary>
    public string CompanyName { get; private set; }

    /// <summary>
    /// Gets the role title held for the professional experience.
    /// </summary>
    public string RoleTitle { get; private set; }

    /// <summary>
    /// Gets the image path used to represent the professional experience.
    /// </summary>
    public string ImagePath { get; private set; }

    /// <summary>
    /// Gets the professional experience summary.
    /// </summary>
    public string RoleSummary { get; private set; }

    /// <summary>
    /// Gets the key contributions delivered in the role.
    /// </summary>
    public IReadOnlyList<string> KeyContributions { get; private set; }

    /// <summary>
    /// Gets the skills and engineering practices used in the role.
    /// </summary>
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
