namespace API.Models;

public class Review
{
    public Guid Id { get; set; }
    public Guid SpecialistId { get; set; }
    public Guid ClientId { get; set; }

    public Guid ConsultationId { get; set; }
    public string FullText { get; set; }
    public decimal Rating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Client { get; set; } = null!;
    public SpecialistProfile Specialist { get; set; } = null!;
}

// public enum ReviewType
// {
//     Positive,
//     Negative
// }

// public ReviewType Type { get; set; } = ReviewType.Positive;