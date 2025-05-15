namespace API.Models
{
    public class Consultation
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SpecialistId { get; set; }
        public User Consultant { get; set; } = null!;
        public Guid ClientId { get; set; }
        public User Client { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal PricePaid { get; set; }
        public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Canceled
    }

    public class ConsultationRequest
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SpecialistId { get; set; }
        public User Consultant { get; set; } = null!;
        public Guid ClientId { get; set; }
        public User Client { get; set; } = null!;
        public string Topic { get; set; } = null!;
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected
        public DateTime ScheduledAt { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? StatusChangedAt { get; set; }
    }
}
