namespace API.Models
{
    public class License
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProfileId { get; set; }
        public Profile Profile { get; set; } = null!;
        public string FileUrl { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
