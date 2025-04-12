namespace API.Models;

public class SpecialistProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string FullName { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string? Subcategory { get; set; }
    public string Resume { get; set; } = null!;
    public decimal PricePerConsultation { get; set; }

    public string? LicenseDocumentUrl { get; set; }
    public bool IsLicenseApproved { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
