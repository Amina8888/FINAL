namespace API.DTOs;
public class RegisterDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!; // "User" или "Specialist"
    public string? ConsultancyArea { get; set; }
}
