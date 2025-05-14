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
public class CalendarController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CalendarController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Specialist")]
    [HttpPost("create-slot")]
    public async Task<IActionResult> CreateSlot([FromBody] CreateCalendarSlotDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var specialist = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (specialist == null) return BadRequest("Profile not found.");

        var slot = new CalendarSlot
        {
            SpecialistId = specialist.Id,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime
        };

        _context.CalendarSlots.Add(slot);
        await _context.SaveChangesAsync();

        return Ok("Slot created.");
    }

    [Authorize(Roles = "Specialist")]
    [HttpGet("my-slots")]
    public async Task<IActionResult> GetMySlots()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var specialist = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (specialist == null) return BadRequest("Profile not found.");

        var slots = await _context.CalendarSlots
            .Where(s => s.SpecialistId == specialist.Id)
            .OrderBy(s => s.StartTime)
            .ToListAsync();

        return Ok(slots);
    }

    [AllowAnonymous]
    [HttpGet("specialist/{id}/available")]
    public async Task<IActionResult> GetAvailableSlots(Guid id)
    {
        var slots = await _context.CalendarSlots
            .Where(s => s.SpecialistId == id && !s.IsBooked && s.StartTime > DateTime.UtcNow)
            .OrderBy(s => s.StartTime)
            .ToListAsync();

        return Ok(slots);
    }
}
