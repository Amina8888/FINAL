
namespace API.Models;
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "User";
    public string? FullName { get; set; }
    public string? About { get; set; }
    public string? PayPalEmail { get; set; } // Только для специалистов
    public bool IsApproved { get; set; } = false; // Только для специалистов

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public SpecialistProfile? SpecialistProfile { get; set; }


    public ICollection<Consultation> ConsultationsAsClient { get; set; } = new List<Consultation>();
    public ICollection<Consultation> ConsultationsAsSpecialist { get; set; } = new List<Consultation>();
}
