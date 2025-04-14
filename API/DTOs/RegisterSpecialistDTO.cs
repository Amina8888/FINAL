namespace API.DTOs;

public class RegisterSpecialistDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string? Subcategory { get; set; }
    public string Resume { get; set; } = null!;
    public decimal PricePerConsultation { get; set; }
}
