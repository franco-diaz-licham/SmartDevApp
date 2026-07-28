using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Portfolio;

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
