namespace API.Models;

public class Profile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? FullName { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? About { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public decimal? PricePerConsultation { get; set; }
    public bool? IsApproved { get; set; } = false;
    public List<WorkExperience>? WorkExperiences { get; set; } = new();
    public List<License>? Licenses { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
