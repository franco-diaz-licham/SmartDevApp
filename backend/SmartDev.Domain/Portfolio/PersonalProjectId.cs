namespace SmartDev.Domain.Portfolio;

public readonly record struct PersonalProjectId(Guid Value)
{
    public static PersonalProjectId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString("D");
}
