
using System;

namespace API.Models
{
    public class ScheduledCall
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid SpecialistId { get; set; }
        public DateTime StartTime { get; set; }
        public string Status { get; set; } = "Scheduled";
    }
}
