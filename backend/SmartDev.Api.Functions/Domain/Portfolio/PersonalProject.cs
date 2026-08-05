using SmartDev.Api.Functions.Domain.Common;

namespace SmartDev.Api.Functions.Domain.Portfolio;

public sealed class PersonalProject : Entity<PersonalProjectId>
{
    private PersonalProject(
        PersonalProjectId id,
        string projectName,
        string subtitle,
        string imagePath,
        string? demoUrl,
        string overview,
        IReadOnlyList<string> impact,
        ProjectTechnologyProfile technology)
        : base(id)
    {
        ProjectName = projectName;
        Subtitle = subtitle;
        ImagePath = imagePath;
        DemoUrl = demoUrl;
        Overview = overview;
        Impact = impact;
        Technology = technology;
    }

    /// <summary>
    /// Gets the project display name.
    /// </summary>
    public string ProjectName { get; private set; }

    /// <summary>
    /// Gets the short project subtitle.
    /// </summary>
    public string Subtitle { get; private set; }

    /// <summary>
    /// Gets the image path used to represent the project.
    /// </summary>
    public string ImagePath { get; private set; }

    /// <summary>
    /// Gets the optional demo URL for the project.
    /// </summary>
    public string? DemoUrl { get; private set; }

    /// <summary>
    /// Gets the project overview text.
    /// </summary>
    public string Overview { get; private set; }

    /// <summary>
    /// Gets the project impact statements.
    /// </summary>
    public IReadOnlyList<string> Impact { get; private set; }

    /// <summary>
    /// Gets the technology profile used by the project.
    /// </summary>
    public ProjectTechnologyProfile Technology { get; private set; }

    public static PersonalProject Create(
        PersonalProjectId id,
        string projectName,
        string subtitle,
        string imagePath,
        string? demoUrl,
        string overview,
        IEnumerable<string> impact,
        ProjectTechnologyProfile technology)
    {
        return new PersonalProject(
            id,
            Guard.Required(projectName, nameof(projectName), 160),
            Guard.Required(subtitle, nameof(subtitle), 160),
            Guard.Required(imagePath, nameof(imagePath), 500),
            Guard.Optional(demoUrl, nameof(demoUrl), 500),
            Guard.Required(overview, nameof(overview), 5000),
            Guard.RequiredList(impact, nameof(impact), 1000),
            technology);
    }
}
