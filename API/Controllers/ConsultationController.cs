using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using System.IO;
using API.Data;
using API.Services;
using API.Models;
using API.DTOs;

[ApiController]
[Route("api/[controller]")]
public class ConsultationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ConsultationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Client")]
    [HttpPost("book")]
    public async Task<IActionResult> BookConsultation([FromBody] BookConsultationDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var client = await _context.Users.FindAsync(Guid.Parse(userId));
        if (client == null) return BadRequest("Client not found");

        var slot = await _context.CalendarSlots
            .FirstOrDefaultAsync(s => s.Id == dto.CalendarSlotId && s.SpecialistId == dto.SpecialistId);

        if (slot == null) return BadRequest("Slot not found.");
        if (slot.IsBooked) return BadRequest("Slot already booked.");

        slot.IsBooked = true;

        var consultation = new Consultation
        {
            SpecialistId = dto.SpecialistId,
            ClientId = client.Id,
            // CalendarSlotId = slot.Id,
            // IsPaid = false // мы подключим оплату позже
        };

        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();

        return Ok("Consultation booked.");
    }

    // [Authorize(Roles = "Client,Specialist")]
    // [HttpGet("my")]
    // public async Task<IActionResult> GetMyConsultations()
    // {
    //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    //     var role = User.FindFirstValue(ClaimTypes.Role);

    //     if (userId == null) return Unauthorized();

    //     var consultationsQuery = _context.Consultations
    //         .Include(c => c.CalendarSlot)
    //         .Include(c => c.Specialist)
    //         .Include(c => c.Client)
    //         .AsQueryable();

    //     if (role == "Client")
    //     {
    //         consultationsQuery = consultationsQuery.Where(c => c.ClientId == Guid.Parse(userId));
    //     }
    //     else if (role == "Specialist")
    //     {
    //         var specialist = await _context.Profiles.FirstOrDefaultAsync(s => s.UserId == Guid.Parse(userId));
    //         if (specialist == null) return BadRequest("Specialist not found.");
    //         consultationsQuery = consultationsQuery.Where(c => c.SpecialistId == specialist.Id);
    //     }

    //     var consultations = await consultationsQuery
    //         .OrderBy(c => c.CalendarSlot.StartTime)
    //         .ToListAsync();

    //     return Ok(consultations);
    // }
}
