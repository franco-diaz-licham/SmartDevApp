using SmartDev.Api.Functions.Domain.Contact;
using SmartDev.Api.Functions.Domain.Content;
using SmartDev.Api.Functions.Domain.Portfolio;

namespace SmartDev.Tests.TestData;

internal static class AggregateTestData
{
    public static ContactMessage CreateContactMessage(
        string senderName = "Ada Lovelace",
        string senderEmail = "ada@example.com",
        string message = "Hello",
        DateTimeOffset? submittedAt = null)
    {
        return ContactMessage.Create(
            senderName: senderName,
            senderEmail: senderEmail,
            message: message,
            submittedAt: submittedAt ?? DateTimeOffset.UtcNow);
    }

    public static WebsiteContent CreateWebsiteContent(
        IEnumerable<PersonalProject>? personalProjects = null,
        IEnumerable<ProfessionalExperience>? professionalExperiences = null,
        DateTimeOffset? updatedAt = null)
    {
        return WebsiteContent.Create(
            id: WebsiteContentId.New(),
            personalProjects: personalProjects ?? [CreatePersonalProject("SmartDev Portfolio")],
            professionalExperiences: professionalExperiences ?? [CreateProfessionalExperience("Contoso")],
            updatedAt: updatedAt ?? DateTimeOffset.UtcNow);
    }

    public static PersonalProject CreatePersonalProject(
        string projectName = "SmartDev Portfolio",
        PersonalProjectId? id = null,
        string demoUrl = "https://example.com",
        IEnumerable<string>? impact = null)
    {
        return PersonalProject.Create(
            id: id ?? PersonalProjectId.New(),
            projectName: projectName,
            subtitle: "Production portfolio",
            imagePath: "/images/portfolio.png",
            demoUrl: demoUrl,
            overview: "A portfolio with a contact workflow.",
            impact: impact ?? ["Clearer client enquiry flow"],
            technology: CreateTechnologyProfile());
    }

    public static ProfessionalExperience CreateProfessionalExperience(
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
            skillsAndPractices: CreateProfessionalSkills());
    }

    public static ProjectTechnologyProfile CreateTechnologyProfile()
    {
        return ProjectTechnologyProfile.Create(
            backend: ".NET Azure Functions",
            frontend: "React",
            cicdCloud: "Azure Static Web Apps",
            architecture: "Clean architecture");
    }

    public static ProfessionalSkills CreateProfessionalSkills()
    {
        return ProfessionalSkills.Create(
            backend: ".NET",
            frontend: "React",
            cicdCloud: "Azure DevOps",
            engineeringPractices: "DDD and automated testing");
    }
}
