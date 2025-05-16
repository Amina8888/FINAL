namespace API.Models
{
    public class ReviewDto
    {
        public Guid ConsultationId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Text { get; set; } = string.Empty;
    }

}
