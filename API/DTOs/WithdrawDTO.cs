namespace API.DTOs;

public class WithdrawDto
{
    public string Method { get; set; } = null!; // например, "PayPal", "Card"
    public string Destination { get; set; } = null!; // email или номер карты
    public double Amount { get; set; }
}
