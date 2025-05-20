namespace API.Models;

public class Review
{
    public Guid Id { get; set; }
    public Guid ConsultationId { get; set; }
    public Guid ClientId { get; set; }
    public Guid SpecialistId { get; set; } 
    public string Text { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Client { get; set; } = null!;
    public User Specialist { get; set; } = null!;
}
