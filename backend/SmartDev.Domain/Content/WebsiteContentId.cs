namespace SmartDev.Domain.Content;

public readonly record struct WebsiteContentId(Guid Value)
{
    public static WebsiteContentId New() => new(Guid.NewGuid());

    public override string ToString() => Value.ToString("D");
}
