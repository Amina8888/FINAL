namespace API.DTOs
{
    public class UpdateProfileDto
    {
        public string FullName { get; set; } = null!;
        public string? About { get; set; }
        public string? Category { get; set; }
        public string? Subcategory { get; set; }
        public string? Resume { get; set; }
        public decimal? PricePerConsultation { get; set; }
        public string? LicenseDocumentUrl { get; set; }
        
    }
}
