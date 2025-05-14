namespace API.Models;

public class Consultation
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SpecialistId { get; set; }
    public Profile Specialist { get; set; } = null!;

    public Guid ClientId { get; set; }
    public User Client { get; set; } = null!;

    public Guid CalendarSlotId { get; set; }
    public CalendarSlot CalendarSlot { get; set; } = null!;

    public string? MeetingUrl { get; set; } // для видеосвязи

    public bool IsPaid { get; set; } = false;
    public bool IsCompleted { get; set; } = false;
    public bool IsConfirmed { get; set; } = false;
}
