// Назначение: Уведомления пользователям и специалистам (например, о подтверждении встречи или напоминания).

// Task SendReminderAsync(string to, string subject, string message);

namespace API.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body);
    }
}
