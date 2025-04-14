using API.Models;
using API.Data;
using API.Services;
using API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class CalendarService : ICalendarService
    {
        private readonly ApplicationDbContext _context;

        public CalendarService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> CreateCalendarSlotAsync(CreateCalendarSlotDto slotDto, string userId)
        {
            var specialist = await _context.SpecialistProfile
                .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

            if (specialist == null) return "Profile not found.";

            var slot = new CalendarSlot
            {
                SpecialistId = specialist.Id,
                StartTime = slotDto.StartTime,
                EndTime = slotDto.EndTime
            };

            _context.CalendarSlots.Add(slot);
            await _context.SaveChangesAsync();

            return "Slot created.";
        }

        public async Task<IEnumerable<CalendarSlot>> GetMySlotsAsync(string userId)
        {
            var specialist = await _context.SpecialistProfile
                .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

            if (specialist == null) return new List<CalendarSlot>();

            return await _context.CalendarSlots
                .Where(s => s.SpecialistId == specialist.Id)
                .OrderBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<CalendarSlot>> GetAvailableSlotsAsync(Guid specialistId)
        {
            return await _context.CalendarSlots
                .Where(s => s.SpecialistId == specialistId && !s.IsBooked && s.StartTime > DateTime.UtcNow)
                .OrderBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<string> RemoveSlotAsync(Guid slotId, string userId)
        {
            var specialist = await _context.SpecialistProfile
                .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

            if (specialist == null) return "Profile not found.";

            var slot = await _context.CalendarSlots
                .FirstOrDefaultAsync(s => s.Id == slotId && s.SpecialistId == specialist.Id);

            if (slot == null) return "Slot not found.";

            _context.CalendarSlots.Remove(slot);
            await _context.SaveChangesAsync();

            return "Slot removed.";
        }
    }
}
