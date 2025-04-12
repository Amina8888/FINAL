namespace API.DTOs
{
    public class UpdateProfileDto
    {
        public string Resume { get; set; } = null!;
        public decimal PricePerConsultation { get; set; }
        public string? Subcategory { get; set; }
    }
}
