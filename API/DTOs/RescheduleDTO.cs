namespace API.DTOs;

public class RescheduleDto
{
    public Guid userId { get; set; }
    public Guid consultationId { get; set; }
    public Guid newSlotId { get; set; }
}
