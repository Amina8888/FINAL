namespace API.DTOs;

using API.Models;

public class BookConsultationDto
{
    public User SpecialistId { get; set; }
    public Guid CalendarSlotId { get; set; }
    public decimal PricePaid { get; set; }
}
