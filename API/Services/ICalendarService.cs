using API.Models;
using API.DTOs;

namespace API.Services
{
    public interface ICalendarService
    {
        Task<string> CreateCalendarSlotAsync(CreateCalendarSlotDto slotDto, string userId);
        Task<IEnumerable<CalendarSlot>> GetMySlotsAsync(string userId);
        Task<IEnumerable<CalendarSlot>> GetAvailableSlotsAsync(Guid specialistId);
        Task<string> RemoveSlotAsync(Guid slotId, string userId);
    }
}
