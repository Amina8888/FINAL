namespace API.Models;

public class Payment
{
    public Guid Id { get; set; }
    public Guid ConsultationId { get; set; }
    public Consultation Consultation { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed
}
