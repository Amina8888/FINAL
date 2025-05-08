// using API.Data;
// using API.DTOs;
// using API.Models;
// using Microsoft.EntityFrameworkCore;
// using System;
// using System.Linq;
// using System.Threading.Tasks;
// using API.Services;

// public class ReminderService : BackgroundService
// {
//     private readonly ILogger<ReminderService> _logger;

//     public ReminderService(ILogger<ReminderService> logger)
//     {
//         _logger = logger;
//     }

//     protected override async Task ExecuteAsync(CancellationToken stoppingToken)
//     {
//         while (!stoppingToken.IsCancellationRequested)
//         {
//             try
//             {
//                 // Здесь логика получения предстоящих консультаций и отправки уведомлений
//                 var upcoming = GetUpcomingConsultations();
//                 foreach (var c in upcoming)
//                 {
//                     SendNotification(c.UserId, $"Напоминание: консультация в {c.StartTime}");
//                     SendNotification(c.SpecialistId, $"Напоминание: консультация в {c.StartTime}");
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Ошибка в ReminderService");
//             }
//             await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // проверка каждые 5 минут
//         }
//     }

//     private List<Consultation> GetUpcomingConsultations()
//     {
//         // Заглушка: заменить на реальный запрос в БД, выбирающий консультации за 30 минут
//         return new List<Consultation>
//         {
//             new Consultation { UserId = "user1", SpecialistId = "spec1", StartTime = DateTime.Now.AddMinutes(30) }
//         };
//     }

//     private void SendNotification(string userId, string message)
//     {
//         // Заглушка: логика добавления в таблицу Notification или отправка через SignalR
//         Console.WriteLine($"[Reminder] {userId}: {message}");
//     }
// }
