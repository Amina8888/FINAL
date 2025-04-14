using API.DTOs;
using API.Models;

namespace API.Services
{
    public interface IClientService
    {
        Task<IEnumerable<SpecialistDto>> GetSpecialistsAsync();
        Task<SpecialistDto> GetSpecialistByIdAsync(Guid id);
        Task<bool> RequestConsultationAsync(BookConsultationDto consultationRequestDto, Guid clientId);
        Task<IEnumerable<Consultation>> GetClientConsultationsAsync(Guid clientId);
        Task<bool> RescheduleConsultationAsync(Guid consultationId, RescheduleDto rescheduleDto, Guid clientId);
        Task<bool> ConfirmConsultationAsync(Guid consultationId, Guid specialistId);
    }
}
