namespace API.DTOs
{
    public class SpecialistDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Category { get; set; }
        public string Subcategory { get; set; }
        public decimal AverageRating { get; set; }
        public string? Resume { get; set; }
        public string? Email { get; set; }
    }
}

