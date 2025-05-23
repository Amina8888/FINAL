
namespace API.Models;
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "User";
    public string? ConsultancyArea { get; set; }

    public Profile? Profile { get; set; }

}
