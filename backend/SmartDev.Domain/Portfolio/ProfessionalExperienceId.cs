namespace SmartDev.Domain.Portfolio;

public readonly record struct ProfessionalExperienceId(Guid Value)
{
    public static ProfessionalExperienceId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString("D");
}
