using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Specialist")]
public class ConsultantController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ConsultantController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
        {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
        if (profile == null) return NotFound("Profile not found");

        var upcomingConsultation = await _context.Consultations
            .Include(c => c.Client)
            .ThenInclude(u => u.Profile)
            .Where(c => c.SpecialistId.ToString() == userId && c.StartTime > DateTime.UtcNow)
            .OrderBy(c => c.StartTime)
            .FirstOrDefaultAsync();

        var requests = await _context.ConsultationRequests
            .Where(r => r.SpecialistId.ToString() == userId)
            .OrderByDescending(r => r.ScheduledAt)
            .ToListAsync();

        var earnings = await _context.Consultations
            .Where(c => c.SpecialistId.ToString() == userId && c.Status == "Completed")
            .SumAsync(c => c.PricePaid);

        return Ok(new
        {
            FullName = profile.FullName ?? "",
            ProfileImageUrl = profile.ProfileImageUrl ?? "https://i.pravatar.cc/150?u=default",
            RequestsCount = requests.Count(),
            Earnings = earnings,
            UpcomingConsultation = upcomingConsultation == null ? null : new
            {
                Date = upcomingConsultation.StartTime.ToString("MMMM dd, yyyy"),
                Time = upcomingConsultation.StartTime.ToString("hh:mm tt"),
                ClientName = upcomingConsultation.Client?.Profile?.FullName ?? "Unknown"
            },
            ConsultationRequests = requests.Select(r => new
            {
                r.Id,
                Client = r.Client?.Profile?.FullName ?? "Unknown",
                Date = r.ScheduledAt.ToString("MMMM dd, yyyy"),
                Topic = r.Topic ?? "No details"
            })
        });
    }
}
