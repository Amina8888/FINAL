using API.Data;
using API.Models;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace API.Services.Implementations
{
    public class ClientService : IClientService
    {
        private readonly ApplicationDbContext _context;

        public ClientService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SpecialistDto>> GetSpecialistsAsync()
        {
            var specialists = await _context.SpecialistProfile
                .Where(u => u.IsApproved)
                .Select(u => new SpecialistDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Category = u.Category,
                    Subcategory = u.Subcategory,
                    AverageRating = u.AverageRating
                })
                .ToListAsync();

            return specialists;
        }

        public async Task<SpecialistDto> GetSpecialistByIdAsync(Guid id)
        {
            var specialist = await _context.SpecialistProfile
                .Where(u => u.Id == id)
                .Select(u => new SpecialistDto
                {
                    FullName = u.FullName,
                    Resume = u.Resume,
                    Email = u.Email
                })
                .FirstOrDefaultAsync();

            return specialist;
        }

        public async Task<bool> RequestConsultationAsync(BookConsultationDto consultationRequestDto, Guid clientId)
        {
            var slot = await _context.CalendarSlots
                .FirstOrDefaultAsync(s => s.Id == consultationRequestDto.CalendarSlotId && s.SpecialistId == consultationRequestDto.SpecialistId);

            if (slot == null || slot.IsBooked) return false;

            var consultation = new Consultation
            {
                SpecialistId = consultationRequestDto.SpecialistId,
                ClientId = clientId,
                CalendarSlotId = slot.Id,
                IsPaid = false
            };

            _context.Consultations.Add(consultation);
            slot.IsBooked = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Consultation>> GetClientConsultationsAsync(Guid clientId)
        {
            return await _context.Consultations
                .Where(c => c.ClientId == clientId)
                .Include(c => c.Specialist)
                .OrderByDescending(c => c.ScheduledAt)
                .ToListAsync();
        }

        public async Task<bool> RescheduleConsultationAsync(Guid consultationId, RescheduleDto rescheduleDto, Guid clientId)
        {
            var consultation = await _context.Consultations
                .Include(c => c.CalendarSlot)
                .FirstOrDefaultAsync(c => c.ConsultationId == consultationId);

            if (consultation == null || (consultation.ClientId != clientId && consultation.SpecialistId != clientId)) return false;

            var newSlot = await _context.CalendarSlots
                .FirstOrDefaultAsync(s => s.Id == rescheduleDto.newSlotId && s.SpecialistId == consultation.SpecialistId);

            if (newSlot == null || newSlot.IsBooked) return false;

            consultation.CalendarSlot.IsBooked = false;
            consultation.CalendarSlotId = newSlot.Id;
            consultation.CalendarSlot = newSlot;
            newSlot.IsBooked = true;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ConfirmConsultationAsync(Guid consultationId, Guid specialistId)
        {
            var consultation = await _context.Consultations
                .FirstOrDefaultAsync(c => c.ConsultationId == consultationId && c.SpecialistId == specialistId);

            if (consultation == null) return false;

            consultation.IsConfirmed = true;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
