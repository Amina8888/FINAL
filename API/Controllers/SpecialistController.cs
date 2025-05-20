using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ConsultantController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ConsultantController(ApplicationDbContext context)
    {
        _context = context;
    }

[Authorize(Roles = "Specialist")]
[HttpGet("dashboard")]
public async Task<IActionResult> GetDashboard()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Unauthorized();

    var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
    if (profile == null) return NotFound("Profile not found");

    // Получаем список ближайших консультаций (до 5)
    var upcoming = await _context.Consultations
        .Include(c => c.Client)
        .ThenInclude(u => u.Profile)
        .Where(c => c.SpecialistId.ToString() == userId && c.Status == "Scheduled" && c.StartTime > DateTime.UtcNow)
        .OrderBy(c => c.StartTime)
        .Take(5)
        .ToListAsync();

    var upcomingConsultations = upcoming.Select(c => new
    {
        Id = c.Id,
        Date = c.StartTime.ToString("MMMM dd, yyyy"),
        Time = c.StartTime.ToString("hh:mm tt"),
        Topic = c.Topic,
        ClientName = c.Client?.Profile?.FullName ?? "Unknown"
    }).ToList();

    var nextConsultation = upcomingConsultations.FirstOrDefault();

    var requests = await _context.ConsultationRequests
        .Include(r => r.Client)
        .ThenInclude(u => u.Profile)
        .Where(r => r.SpecialistId.ToString() == userId && r.Status == "Pending")
        .OrderByDescending(r => r.ScheduledAt)
        .ToListAsync();

    var earnings = await _context.Consultations
        .Where(c => c.SpecialistId.ToString() == userId && c.Status == "Completed")
        .SumAsync(c => c.PricePaid);

    return Ok(new
    {
        FullName = profile.FullName ?? "",
        ProfileImageUrl = profile.ProfileImageUrl ?? "https://i.pravatar.cc/150?u=default",
        RequestsCount = requests.Count,
        Earnings = earnings,
        NextConsultation = nextConsultation,
        UpcomingConsultations = upcomingConsultations,
        ConsultationRequests = requests.Select(r => new
        {
            r.Id,
            ClientName = r.Client?.Profile?.FullName ?? "Unknown",
            Date = r.ScheduledAt.ToString("MMMM dd, yyyy"),
            Topic = r.Topic ?? "No details"
        })
    });
}

[HttpGet("search")]
[AllowAnonymous]
public async Task<IActionResult> SearchSpecialists(
    string? search = null,
    string? specialization = null,
    string? keyword = null,
    decimal? minPrice = null,
    decimal? maxPrice = null,
    string? sortBy = "rating"
)
{
    var baseQuery = _context.Profiles
        .Include(p => p.User)
        .Where(p => p.IsApproved == true);

    if (!string.IsNullOrEmpty(search))
        baseQuery = baseQuery.Where(p => p.FullName.Contains(search));

    if (!string.IsNullOrEmpty(specialization))
        baseQuery = baseQuery.Where(p => p.Category == specialization);

    if (!string.IsNullOrEmpty(keyword))
        baseQuery = baseQuery.Where(p => p.About.Contains(keyword));

    if (minPrice.HasValue)
        baseQuery = baseQuery.Where(p => p.PricePerConsultation >= minPrice.Value);

    if (maxPrice.HasValue)
        baseQuery = baseQuery.Where(p => p.PricePerConsultation <= maxPrice.Value);

    var query = from profile in baseQuery
                join reviewGroup in _context.Reviews
                    .GroupBy(r => r.ConsultationId)
                    .Select(g => new { ConsultationId = g.Key, AvgRating = g.Average(r => r.Rating) })
                on profile.Id equals reviewGroup.ConsultationId into ratings
                from rating in ratings.DefaultIfEmpty()
                select new
                {
                    profile.Id,
                    FullName = profile.FullName,
                    profile.Category,
                    profile.Subcategory,
                    profile.PricePerConsultation,
                    profile.ProfileImageUrl,
                    Rating = rating != null ? rating.AvgRating : 0.0
                };

    // Сортировка
    query = sortBy switch
    {
        "price" => query.OrderBy(p => p.PricePerConsultation),
        "rating" => query.OrderByDescending(p => p.Rating),
        _ => query.OrderByDescending(p => p.Rating)
    };

    var result = await query.ToListAsync();

    return Ok(result);
}

}
