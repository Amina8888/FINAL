namespace API.DTOs;

using API.Models;

public class BookConsultationDto
{
    public Guid SpecialistId { get; set; }
    public DateTimeOffset ScheduledAt { get; set; }
    public string? Topic { get; set; }
}
