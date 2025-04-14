namespace API.DTOs;

public class BookConsultationDto
{
    public Guid SpecialistId { get; set; }
    public Guid CalendarSlotId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string ProblemDescription { get; set; } = string.Empty;
}

