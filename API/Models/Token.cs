// Если используется система JWT для аутентификации, может понадобиться модель для хранения токенов (например, для восстановления пароля или регистрации)

namespace API.Models;

public class Token
{
    public Guid Id { get; set; }
    public string TokenValue { get; set; }
    public DateTime ExpiryDate { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
}
