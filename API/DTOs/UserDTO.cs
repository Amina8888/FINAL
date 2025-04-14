namespace API.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? About { get; set; }
        public string? PayPalEmail { get; set; }
        public bool IsApproved { get; set; }
    }
}
