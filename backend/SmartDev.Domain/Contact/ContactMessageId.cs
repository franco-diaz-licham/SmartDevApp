namespace SmartDev.Domain.Contact;

public readonly record struct ContactMessageId(Guid Value)
{
    public static ContactMessageId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString("D");
}
