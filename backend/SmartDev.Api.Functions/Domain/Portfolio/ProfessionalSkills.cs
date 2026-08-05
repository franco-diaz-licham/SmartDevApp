using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Portfolio;

/// <param name="Backend">The backend skills, frameworks, and practices.</param>
/// <param name="Frontend">The frontend skills, frameworks, and practices.</param>
/// <param name="CicdCloud">The CI/CD, cloud, and data platform skills.</param>
/// <param name="EngineeringPractices">The broader engineering practices represented by the experience.</param>
public sealed record ProfessionalSkills(
    string Backend,
    string Frontend,
    string CicdCloud,
    string EngineeringPractices)
{
    public static ProfessionalSkills Create(
        string backend,
        string frontend,
        string cicdCloud,
        string engineeringPractices)
    {
        return new ProfessionalSkills(
            Guard.Required(backend, nameof(backend), 1000),
            Guard.Required(frontend, nameof(frontend), 1000),
            Guard.Required(cicdCloud, nameof(cicdCloud), 1000),
            Guard.Required(engineeringPractices, nameof(engineeringPractices), 1000));
    }
}
