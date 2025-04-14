using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.Models;
using API.DTOs;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Добавить отзыв (можно только если консультация завершена, оплата прошла, и отзыв ещё не оставлен)
    [Authorize(Roles = "User")]
    [HttpPost("add/{specialistId}")]
    public async Task<IActionResult> AddReview(Guid specialistId, [FromBody] AddReviewDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var consultation = await _context.Consultations
            .Include(c => c.Review)
            .FirstOrDefaultAsync(c => c.ClientId == userId && c.SpecialistId == specialistId && c.IsCompleted && c.IsPaid);

        if (consultation == null)
            return BadRequest("You have no completed consultation with this specialist.");

        if (consultation.Review != null)
            return BadRequest("You have already left a review for this consultation.");

        var review = new Review
        {
            ConsultationId = consultation.ConsultationId,
            SpecialistId = specialistId,
            ClientId = userId,
            Rating = dto.Rating,
            FullText = dto.FullText
        };

        _context.Review.Add(review);
        await _context.SaveChangesAsync();
        // Пересчитать рейтинг специалиста
        var ratings = await _context.Review
            .Where(r => r.SpecialistId == specialistId)
            .Select(r => r.Rating)
            .ToListAsync();

        var average = ratings.Any() ? ratings.Average() : 0;

        var specialist = await _context.Users.FindAsync(specialistId);
        if (specialist != null)
        {
            specialist.AverageRating = Math.Round(average, 2);
            await _context.SaveChangesAsync();
        }

        return Ok("Review submitted.");
    }

    // Проверить, можно ли оставить отзыв
    [Authorize(Roles = "User")]
    [HttpGet("check/{consultationId}")]
    public async Task<IActionResult> CanLeaveReview(Guid consultationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var consultation = await _context.Consultations
            .Include(c => c.Review)
            .FirstOrDefaultAsync(c => c.ConsultationId == consultationId && c.ClientId == userId);

        if (consultation == null)
            return NotFound("Consultation not found.");

        var canReview = consultation.IsCompleted && consultation.IsPaid && consultation.Review == null;

        return Ok(new { canLeaveReview = canReview });
    }

    // Получить отзывы по специалисту
    [AllowAnonymous]
    [HttpGet("specialist/{id}")]
    public async Task<IActionResult> GetReviews(Guid id)
    {
        var reviews = await _context.Review
            .Where(r => r.SpecialistId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Rating,
                r.FullText,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }
}

