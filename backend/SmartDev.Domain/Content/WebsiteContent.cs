using SmartDev.Domain.Common;
using SmartDev.Domain.Portfolio;

namespace SmartDev.Domain.Content;

public sealed class WebsiteContent : Entity<Guid>
{
    public static readonly Guid DefaultId = Guid.Parse("3c1a9e6f-3f86-4f03-97fd-91a3df9cb5a1");

    private WebsiteContent(
        Guid id,
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
        IEnumerable<PersonalProject> personalProjects,
        IEnumerable<ProfessionalExperience> professionalExperiences,
        DateTimeOffset updatedAt)
    {
        return new WebsiteContent(
            DefaultId,
            EnsureAny(personalProjects, nameof(personalProjects)),
            EnsureAny(professionalExperiences, nameof(professionalExperiences)),
            updatedAt);
    }

    public void ReplaceContent(
        IEnumerable<PersonalProject> personalProjects,
        IEnumerable<ProfessionalExperience> professionalExperiences,
        DateTimeOffset updatedAt)
    {
        PersonalProjects = EnsureAny(personalProjects, nameof(personalProjects));
        ProfessionalExperiences = EnsureAny(professionalExperiences, nameof(professionalExperiences));
        UpdatedAt = updatedAt;
    }

    private static IReadOnlyList<T> EnsureAny<T>(IEnumerable<T> values, string parameterName)
    {
        var items = values.ToArray();
        if (items.Length == 0) throw new ArgumentException($"{parameterName} must contain at least one item.", parameterName);

        return items;
    }
}
