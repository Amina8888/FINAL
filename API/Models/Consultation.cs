namespace API.Models
{
    public class Consultation
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid SpecialistId { get; set; }
        public User Specialist { get; set; } = null!;

        public Guid ClientId { get; set; }
        public User Client { get; set; } = null!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal PricePaid { get; set; }
        public string Topic { get; set; } = null!;
        public string Status { get; set; } = "Scheduled";
        public string? CancelReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ConsultationRequest
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid SpecialistId { get; set; }
        public User Specialist { get; set; } = null!;

        public Guid ClientId { get; set; }
        public User Client { get; set; } = null!;

        public string Topic { get; set; } = null!;
        public string Status { get; set; } = "Pending";
        public string? RejectionReason { get; set; }
        public DateTime ScheduledAt { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? StatusChangedAt { get; set; }
    }
}
