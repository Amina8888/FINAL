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
    private readonly IConsultationService _consultationService;

    public ConsultationController(ApplicationDbContext context, IConsultationService consultationService)
    {
        _context = context;
        _consultationService = consultationService; 
    }

    [Authorize(Roles = "Client")]
    [HttpPost("book/{specialistId}")]
    public async Task<IActionResult> BookConsultation([FromBody] BookConsultationDto dto)
    {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var clientId = Guid.Parse(userId);

            var success = await _consultationService.BookConsultation(clientId, dto);
            if (!success)
                return BadRequest("Failed to book consultation. Please check the slot availability.");

            return Ok("Consultation booked.");
    }

    [Authorize(Roles = "Client,Specialist")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyConsultations()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (userId == null) return Unauthorized();

        var consultationsQuery = _context.Consultations
            .Include(c => c.CalendarSlot)
            .Include(c => c.Specialist)
            .Include(c => c.Client)
            .AsQueryable();

        if (role == "Client")
        {
            consultationsQuery = consultationsQuery.Where(c => c.ClientId == Guid.Parse(userId));
        }
        else if (role == "Specialist")
        {
            var specialist = await _context.SpecialistProfile.FirstOrDefaultAsync(s => s.UserId == Guid.Parse(userId));
            if (specialist == null) return BadRequest("Specialist not found.");
            consultationsQuery = consultationsQuery.Where(c => c.SpecialistId == specialist.Id);
        }

        var consultations = await consultationsQuery
            .OrderBy(c => c.CalendarSlot.StartTime)
            .ToListAsync();

        return Ok(consultations);
    }

    [Authorize(Roles = "Client,Specialist")]
    [HttpPost("reschedule/{consultationId}")]
    public async Task<IActionResult> RescheduleConsultation(Guid consultationId, [FromBody] Guid newSlotId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _consultationService.Reschedule(Guid.Parse(userId), consultationId, newSlotId);
        if (!success)
            return BadRequest("Failed to reschedule consultation.");

        return Ok("Consultation rescheduled successfully.");
    }

}
