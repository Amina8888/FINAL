using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/user/dashboard")]
[Authorize(Roles = "User")]
public class UserDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserDashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        Guid userGuid = Guid.Parse(userId);

        var upcomingConsultations = await _context.Consultations
            .Include(c => c.Specialist)
            .ThenInclude(s => s.Profile)
            .Where(c => c.ClientId == userGuid && c.StartTime > DateTime.UtcNow && c.Status == "Scheduled")
            .OrderBy(c => c.StartTime)
            .ToListAsync();

        var nextConsultation = upcomingConsultations.FirstOrDefault();

        var previousConsultations = await _context.Consultations
            .Include(c => c.Specialist)
            .ThenInclude(s => s.Profile)
            .Where(c => c.ClientId == userGuid && c.StartTime < DateTime.UtcNow && c.Status == "Completed")
            .OrderByDescending(c => c.StartTime)
            .ToListAsync();

        var pendingRequests = await _context.ConsultationRequests
            .Where(r => r.ClientId == userGuid)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();

        var totalSpent = await _context.Consultations
            .Where(c => c.ClientId == userGuid && c.Status == "Completed")
            .SumAsync(c => c.PricePaid);

        return Ok(new
        {
            NextConsultation = nextConsultation == null ? null : new
            {
                nextConsultation.Id,
                Date = nextConsultation.StartTime.ToString("MMMM dd, yyyy"),
                Time = nextConsultation.StartTime.ToString("hh:mm tt"),
                SpecialistName = nextConsultation.Specialist.Profile.FullName,
                nextConsultation.Topic,
                nextConsultation.PricePaid
            },
            UpcomingConsultations = upcomingConsultations.Select(c => new
            {
                c.Id,
                Date = c.StartTime.ToString("MMMM dd, yyyy"),
                Time = c.StartTime.ToString("hh:mm tt"),
                SpecialistName = c.Specialist.Profile.FullName,
                c.Topic,
                c.PricePaid
            }),
            PreviousConsultations = previousConsultations.Select(c => new
            {
                c.Id,
                Date = c.StartTime.ToString("MMMM dd, yyyy"),
                Time = c.StartTime.ToString("hh:mm tt"),
                SpecialistName = c.Specialist.Profile.FullName,
                c.Topic,
                c.PricePaid
            }),
            PendingRequests = pendingRequests.Select(r => new
            {
                r.Id,
                Date = r.RequestedAt.ToString("MMMM dd, yyyy"),
                r.Topic,
                r.Status,
                r.RejectionReason
            }),
            TotalSpent = totalSpent,
            TotalConsultations = previousConsultations.Count()
        });
    }
}
