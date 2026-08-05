using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Portfolio;

/// <param name="Backend">The backend technologies used by the project.</param>
/// <param name="Frontend">The frontend technologies used by the project.</param>
/// <param name="CicdCloud">The CI/CD, cloud, and data technologies used by the project.</param>
/// <param name="Architecture">The architecture style and major technical patterns used by the project.</param>
public sealed record ProjectTechnologyProfile(
    string Backend,
    string Frontend,
    string CicdCloud,
    string Architecture)
{
    public static ProjectTechnologyProfile Create(
        string backend,
        string frontend,
        string cicdCloud,
        string architecture)
    {
        return new ProjectTechnologyProfile(
            Guard.Required(backend, nameof(backend), 1000),
            Guard.Required(frontend, nameof(frontend), 1000),
            Guard.Required(cicdCloud, nameof(cicdCloud), 1000),
            Guard.Required(architecture, nameof(architecture), 1000));
    }
}
