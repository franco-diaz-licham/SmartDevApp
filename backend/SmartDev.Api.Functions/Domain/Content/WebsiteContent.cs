using SmartDev.Api.Functions.Domain.Common;
using SmartDev.Api.Functions.Domain.Portfolio;

namespace SmartDev.Api.Functions.Domain.Content;

public sealed class WebsiteContent : Entity<WebsiteContentId>
{
    private WebsiteContent(
        WebsiteContentId id,
        IReadOnlyList<PersonalProject> personalProjects,
        IReadOnlyList<ProfessionalExperience> professionalExperiences,
        DateTimeOffset? updatedAt)
        : base(id)
    {
        PersonalProjects = personalProjects;
        ProfessionalExperiences = professionalExperiences;
        if (updatedAt is not null) Touch(updatedAt.Value);
    }

    /// <summary>
    /// Gets the personal projects shown on the website.
    /// </summary>
    public IReadOnlyList<PersonalProject> PersonalProjects { get; private set; }

    /// <summary>
    /// Gets the professional experiences shown on the website.
    /// </summary>
    public IReadOnlyList<ProfessionalExperience> ProfessionalExperiences { get; private set; }

    public static WebsiteContent Create(
        WebsiteContentId id,
        IEnumerable<PersonalProject> personalProjects,
        IEnumerable<ProfessionalExperience> professionalExperiences,
        DateTimeOffset updatedAt)
    {
        return new WebsiteContent(
            id,
            Guard.EnsureAny(personalProjects, nameof(personalProjects)),
            Guard.EnsureAny(professionalExperiences, nameof(professionalExperiences)),
            updatedAt);
    }

    public void ReplaceContent(
        IEnumerable<PersonalProject> personalProjects,
        IEnumerable<ProfessionalExperience> professionalExperiences,
        DateTimeOffset updatedAt)
    {
        PersonalProjects = Guard.EnsureAny(personalProjects, nameof(personalProjects));
        ProfessionalExperiences = Guard.EnsureAny(professionalExperiences, nameof(professionalExperiences));
        Touch(updatedAt);
    }
}
