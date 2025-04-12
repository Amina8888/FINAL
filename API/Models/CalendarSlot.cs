namespace API.Models;

public class CalendarSlot
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SpecialistId { get; set; }
    public SpecialistProfile Specialist { get; set; } = null!;

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public bool IsBooked { get; set; } = false;
}
