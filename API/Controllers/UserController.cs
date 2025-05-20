using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "User")]
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetUserDashboard()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
        if (profile == null) return NotFound("Profile not found");

        var upcomingConsultations = await _context.Consultations
            .Include(c => c.Specialist).ThenInclude(s => s.Profile)
            .Where(c => c.ClientId.ToString() == userId && c.Status == "Scheduled" && c.StartTime > DateTime.UtcNow)
            .OrderBy(c => c.StartTime)
            .Take(5)
            .ToListAsync();

        // Получаем все отправленные пользователем запросы
        var myRequests = await _context.ConsultationRequests
            .Include(r => r.Specialist)
            .ThenInclude(s => s.Profile)
            .Where(r => r.ClientId.ToString() == userId)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();

        // Получаем прошедшие консультации
        var pastConsultations = await _context.Consultations
            .Include(c => c.Specialist)
            .ThenInclude(u => u.Profile)
            .Where(c => c.ClientId.ToString() == userId && c.Status == "Completed")
            .OrderByDescending(c => c.StartTime)
            .ToListAsync();

        var totalSpent = await _context.Consultations
            .Where(c => c.ClientId.ToString() == userId && c.Status == "Completed")
            .SumAsync(c => c.PricePaid);

        return Ok(new
        {
            FullName = profile.FullName ?? "",
            ProfileImageUrl = profile.ProfileImageUrl ?? "https://i.pravatar.cc/150?u=default",
            TotalSpent = totalSpent,
            TotalConsultations = pastConsultations.Count,
            NextConsultation = upcomingConsultations.Select(c => new {
                c.Id,
                Date = c.StartTime.ToString("MMMM dd, yyyy"),
                Time = c.StartTime.ToString("hh:mm tt"),
                Topic = c.Topic,
                SpecialistName = c.Specialist?.Profile?.FullName ?? "Unknown"
            }).FirstOrDefault(),
            UpcomingConsultations = upcomingConsultations.Select(c => new {
                c.Id,
                Date = c.StartTime.ToString("MMMM dd, yyyy"),
                Time = c.StartTime.ToString("hh:mm tt"),
                Topic = c.Topic,
                SpecialistName = c.Specialist?.Profile?.FullName ?? "Unknown"
            }),
            MyRequests = myRequests.Select(r => new
            {
                r.Id,
                ScheduledAt = r.ScheduledAt.ToString("MMMM dd, yyyy hh:mm tt"),
                Topic = r.Topic ?? "No topic",
                SpecialistName = r.Specialist?.Profile?.FullName ?? "Unknown",
                Status = r.Status
            }),

            PastConsultations = pastConsultations.Select(c => new
            {
                c.Id,
                Date = c.StartTime.ToString("MMMM dd, yyyy"),
                Time = c.StartTime.ToString("hh:mm tt"),
                Topic = c.Topic,
                SpecialistName = c.Specialist?.Profile?.FullName ?? "Unknown",
                CanLeaveReview = !_context.Reviews.Any(r => r.ConsultationId == c.Id) // если отзыв не оставлен
            })
        });
    }
}
