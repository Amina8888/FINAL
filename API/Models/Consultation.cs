namespace API.Models;

public class Consultation
{
    public Guid ConsultationId { get; set; } = Guid.NewGuid();

    public Guid SpecialistId { get; set; }
    public Guid ClientId { get; set; }
    public User Client { get; set; } = null!;
    public User Specialist { get; set; } = null!;
    public Guid CalendarSlotId { get; set; }
    public CalendarSlot CalendarSlot { get; set; } = null!;

    public string Description { get; set; } = string.Empty;

    public string? MeetingUrl { get; set; } // для видеосвязи
    public DateTime ScheduledAt { get; set; }
    public bool IsPaid { get; set; } = false;
    public bool IsCompleted { get; set; } = false;
    public bool IsConfirmed { get; set; } = false;
    public bool IsRejected { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    public Review? Review { get; set; }
}

// public enum ConsultationStatus
// {
//     Pending,
//     Confirmed,
//     Completed,
//     Rejected
// }

// public ConsultationStatus Status { get; set; } = ConsultationStatus.Pending;