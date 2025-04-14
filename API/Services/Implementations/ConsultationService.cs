using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using API.Services;

namespace API.Services.Implementations
{
    public class ConsultationService : IConsultationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public ConsultationService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<bool> BookConsultation(Guid clientId, BookConsultationDto dto)
        {
            var client = await _context.Users.FindAsync(clientId);
            if (client == null) return false;  // Client not found

            var slot = await _context.CalendarSlots
                .FirstOrDefaultAsync(s => s.Id == dto.CalendarSlotId && s.SpecialistId == dto.SpecialistId);

            if (slot == null || slot.IsBooked) return false;  // Slot not found or already booked

            slot.IsBooked = true;

            var consultation = new Consultation
            {
                SpecialistId = dto.SpecialistId,
                ClientId = client.Id,
                CalendarSlotId = slot.Id,
                IsPaid = false  // We will integrate payment later
            };

            _context.Consultations.Add(consultation);
            await _context.SaveChangesAsync();

            // Optional: Send an email to the specialist
            var specialist = await _context.Users.FindAsync(dto.SpecialistId);
            if (specialist != null)
            {
                await _emailService.SendAsync(specialist.Email, "New Consultation Booking",
                    $"A new consultation has been booked by client {client.FullName}. Scheduled time: {slot.StartTime}.");
            }

            return true;  // Consultation successfully booked
        }

        public async Task<bool> Reschedule(Guid userId, Guid consultationId, Guid newSlotId)
        {
            // Находим консультацию по ID
            var consultation = await _context.Consultations
                .Include(c => c.CalendarSlot)  // Для получения текущего слота
                .FirstOrDefaultAsync(c => c.ConsultationId == consultationId);  // Используем consultationId для поиска

            if (consultation == null) return false;  // Консультация не найдена

            // Проверка, что пользователь, который делает запрос, является либо клиентом, либо специалистом
            if (consultation.ClientId != userId && consultation.SpecialistId != userId)
                return false;  // Только клиент или специалист могут перенести консультацию

            // Находим новый слот
            var newSlot = await _context.CalendarSlots
                .FirstOrDefaultAsync(s => s.Id == newSlotId && s.SpecialistId == consultation.SpecialistId);

            if (newSlot == null || newSlot.IsBooked) return false;  // Новый слот не найден или уже забронирован

            // Освобождаем старый слот
            consultation.CalendarSlot.IsBooked = false;

            // Назначаем новый слот для консультации
            consultation.CalendarSlotId = newSlot.Id;
            consultation.CalendarSlot = newSlot;  // Обновляем объект в памяти

            // Помечаем новый слот как забронированный
            newSlot.IsBooked = true;

            // Сохраняем изменения в базе данных
            await _context.SaveChangesAsync();

            // Отправляем уведомление специалисту
            var specialist = await _context.Users.FindAsync(consultation.SpecialistId);
            if (specialist != null)
            {
                await _emailService.SendAsync(specialist.Email, "Consultation Rescheduled",
                    $"The consultation with client {consultation.Client.FullName} has been rescheduled to {newSlot.StartTime}.");
            }

            return true;  // Консультация успешно перенесена
        }

        public async Task<IEnumerable<Consultation>> GetConsultationRequests(Guid specialistId)
        {
            return await _context.Consultations
                .Where(c => c.SpecialistId == specialistId && !c.IsConfirmed)
                .Include(c => c.Client)
                .ToListAsync();
        }

        public async Task<bool> ConfirmConsultation(Guid consultationId)
        {
            var consultation = await _context.Consultations.FindAsync(consultationId);
            if (consultation == null) return false;

            consultation.IsConfirmed = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectConsultation(Guid consultationId)
        {
            var consultation = await _context.Consultations.FindAsync(consultationId);
            if (consultation == null) return false;

            consultation.IsRejected = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Consultation>> GetConsultationHistory(Guid specialistId)
        {
            return await _context.Consultations
                .Where(c => c.SpecialistId == specialistId && c.ScheduledAt < DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task<bool> WithdrawFunds(Guid specialistId, WithdrawDto dto)
        {
            var user = await _context.Users.FindAsync(specialistId);
            if (user == null || string.IsNullOrEmpty(user.PayPalEmail))
                return false;

            // Логика для отправки заявки на вывод через PayPal
            return true;
        }

        public async Task<bool> SyncGoogleCalendar(Guid specialistId)
        {
            // Логика для синхронизации календаря с Google
            return true;
        }

        public async Task<bool> UpdateProfile(Guid specialistId, UpdateProfileDto dto)
        {
            var profile = await _context.SpecialistProfile
                .FirstOrDefaultAsync(p => p.UserId == specialistId);

            if (profile == null) return false;

            profile.Resume = dto.Resume;
            profile.PricePerConsultation = dto.PricePerConsultation;
            profile.Subcategory = dto.Subcategory;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UploadLicense(Guid specialistId, UploadLicenseDto dto)
        {
            var profile = await _context.SpecialistProfile
                .FirstOrDefaultAsync(p => p.UserId == specialistId);

            if (profile == null) return false;

            var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
            var path = Path.Combine("wwwroot", "licenses", fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            profile.LicenseDocumentUrl = $"/licenses/{fileName}";
            profile.IsLicenseApproved = false;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetPayPalEmail(Guid specialistId, string email)
        {
            var user = await _context.Users.FindAsync(specialistId);
            if (user == null) return false;

            user.PayPalEmail = email;
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
