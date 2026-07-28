using System.ComponentModel.DataAnnotations;

namespace SmartDev.Worker.Functions.Infrastructure.Options;

/// <summary>
/// Configures email delivery for contact messages received by the worker.
/// </summary>
public sealed class ContactEmailOptions
{
    /// <summary>
    /// Gets the configuration section name used for contact email settings.
    /// </summary>
    public const string SectionName = "ContactEmail";

    /// <summary>
    /// Gets the email address that receives contact form messages.
    /// </summary>
    [Required]
    public string RecipientAddress { get; init; } = string.Empty;

    /// <summary>
    /// Gets the subject prefix used for contact form notification emails.
    /// </summary>
    [Required]
    public string SubjectPrefix { get; init; } = "New portfolio contact message";
}
