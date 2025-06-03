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
            .Where(c => c.SpecialistId.ToString() == userId && c.Status == "Scheduled" && c.StartTime > DateTime.UtcNow.AddMinutes(-59))
            .OrderBy(c => c.StartTime)
            .Take(5)
            .ToListAsync();

        var upcomingConsultations = upcoming.Select(c => new
        {
            Id = c.Id,
            ScheduledAt = c.StartTime,
            Topic = c.Topic,
            ClientName = c.Client?.Profile?.FullName ?? "Unknown",
            ClientId = c.ClientId
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
                ScheduledAt = r.ScheduledAt,
                Topic = r.Topic ?? "No details"
            })
        });
    }

    [Authorize(Roles = "User")]
    [HttpGet("search")]
    public async Task<IActionResult> SearchSpecialists(
        string? search = null,
        string? specialization = null,
        string? keyword = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        string? sortBy = "rating",
        int page = 1,
        int limit = 10
    )
    {
        var baseQuery = _context.Profiles
            .Include(p => p.User)
            .Where(p => p.IsApproved == true && p.Role == "Specialist");

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

        // Paging
        var profiles = await baseQuery
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var userIds = profiles.Select(p => p.User.Id).ToList();

        // Ratings by SpecialistId = UserId
        var ratings = await _context.Reviews
            .Where(r => userIds.Contains(r.SpecialistId))
            .GroupBy(r => r.SpecialistId)
            .Select(g => new
            {
                SpecialistId = g.Key,
                AvgRating = g.Average(r => r.Rating)
            })
            .ToListAsync();

        var result = profiles.Select(p => new
        {
            p.User.Id,
            FullName = p.FullName,
            p.Category,
            p.Subcategory,
            p.PricePerConsultation,
            p.ProfileImageUrl,
            Rating = ratings.FirstOrDefault(r => r.SpecialistId == p.User.Id)?.AvgRating ?? 0.0
        });

        // Optional sorting
        result = sortBy switch
        {
            "price" => result.OrderBy(p => p.PricePerConsultation),
            "rating" => result.OrderByDescending(p => p.Rating),
            _ => result
        };

        var totalCount = await baseQuery.CountAsync();

        return Ok(new
        {
            Items = result,
            TotalCount = totalCount
        });
    }


}
