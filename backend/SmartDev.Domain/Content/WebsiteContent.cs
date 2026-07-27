using SmartDev.Domain.Common;
using SmartDev.Domain.Portfolio;

namespace SmartDev.Domain.Content;

public sealed class WebsiteContent : Entity<WebsiteContentId>
{
    private WebsiteContent(
        WebsiteContentId id,
        IReadOnlyList<PersonalProject> personalProjects,
        IReadOnlyList<ProfessionalExperience> professionalExperiences,
        DateTimeOffset updatedAt)
        : base(id)
    {
        PersonalProjects = personalProjects;
        ProfessionalExperiences = professionalExperiences;
        UpdatedAt = updatedAt;
    }

    public IReadOnlyList<PersonalProject> PersonalProjects { get; private set; }

    public IReadOnlyList<ProfessionalExperience> ProfessionalExperiences { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }


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
        UpdatedAt = updatedAt;
    }
}
