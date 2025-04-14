// Назначение: Вынести всю бизнес-логику по созданию/одобрению консультаций

using API.DTOs;
using System;
using System.Threading.Tasks;
using API.Models;

namespace API.Services

{
public interface IConsultationService
    {
        // Task<IEnumerable<Consultation>> GetConsultationRequests(Guid specialistId);
        Task<bool> ConfirmConsultation(Guid consultationId);
        Task<bool> RejectConsultation(Guid consultationId);
        // Task<IEnumerable<Consultation>> GetConsultationHistory(Guid specialistId);
        Task<bool> WithdrawFunds(Guid specialistId, WithdrawDto dto);
        Task<bool> SyncGoogleCalendar(Guid specialistId);
        Task<bool> UpdateProfile(Guid specialistId, UpdateProfileDto dto);
        Task<bool> UploadLicense(Guid specialistId, UploadLicenseDto dto);
        Task<bool> SetPayPalEmail(Guid specialistId, string email);
        Task<bool> BookConsultation(Guid clientId, BookConsultationDto dto);  // Новый метод
        Task<bool> Reschedule(Guid userId, Guid consultationId, Guid newSlotId); 
        Task<IEnumerable<Consultation>> GetConsultationRequests(Guid specialistId);

    }

}
