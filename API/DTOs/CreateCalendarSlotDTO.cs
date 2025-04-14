namespace API.DTOs;

public class CreateCalendarSlotDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public string? TimeZone { get; set; } // Например: "Asia/Almaty"
}
