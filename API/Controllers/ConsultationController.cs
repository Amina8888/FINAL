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
[Authorize]
public class ConsultationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ConsultationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "User")]
    [HttpPost("book")]
    public async Task<IActionResult> BookConsultationRequest([FromBody] BookConsultationDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var specialist = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == dto.SpecialistId);

        if (specialist == null)
            return NotFound("Specialist not found");

        if (dto.ScheduledAt < DateTime.UtcNow)
            return BadRequest("Cannot request consultation in the past");

        var request = new ConsultationRequest
        {
            Id = Guid.NewGuid(),
            ClientId = Guid.Parse(userId),
            SpecialistId = dto.SpecialistId,
            ScheduledAt = dto.ScheduledAt,
            Topic = dto.Topic ?? "General inquiry",
            RequestedAt = DateTime.UtcNow,
            Status = "Pending"
        };

        _context.ConsultationRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Consultation request sent", requestId = request.Id });
    }


    [HttpPost("cancel/{id}")]
    public async Task<IActionResult> CancelConsultation(Guid id, [FromBody] CancelDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var consultation = await _context.Consultations.FirstOrDefaultAsync(c => c.Id == id);
        if (consultation == null || consultation.Status != "Scheduled")
            return BadRequest("Consultation not found or already canceled.");

        if ((consultation.StartTime - DateTime.UtcNow).TotalHours < 8)
            return BadRequest("Cannot cancel within 8 hours of start.");

        if (
            (role == "Client" && consultation.ClientId.ToString() != userId) ||
            (role == "Specialist" && consultation.SpecialistId.ToString() != userId)
        )
            return Forbid("You are not authorized to cancel this consultation.");

        consultation.Status = "Canceled";
        consultation.CancelReason = dto.Reason;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Consultation canceled." });
    }

    [HttpPost("reschedule/{id}")]
    public async Task<IActionResult> RescheduleConsultation(Guid id, [FromBody] DateTime newTime)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var consultation = await _context.Consultations.FirstOrDefaultAsync(c => c.Id == id);
        if (consultation == null || consultation.Status != "Scheduled")
            return BadRequest("Consultation not found or not reschedulable.");

        if ((consultation.StartTime - DateTime.UtcNow).TotalHours < 6)
            return BadRequest("Cannot reschedule within 6 hours of start.");

        if (
            (role == "Client" && consultation.ClientId.ToString() != userId) ||
            (role == "Specialist" && consultation.SpecialistId.ToString() != userId)
        )
            return Forbid("You are not authorized to reschedule this consultation.");

        consultation.StartTime = newTime;
        consultation.EndTime = newTime.AddMinutes(60); // adjust as needed

        await _context.SaveChangesAsync();

        return Ok(new { message = "Consultation rescheduled." });
    }

    [Authorize(Roles = "User")]
    [HttpPost("review/{id}")]
    public async Task<IActionResult> LeaveReview(Guid id, [FromBody] ReviewDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        var consultation = await _context.Consultations
            .FirstOrDefaultAsync(c => c.Id == id && c.ClientId.ToString() == userId && c.Status == "Completed");

        if (consultation == null)
            return BadRequest("Consultation not found or not eligible for review.");

        var review = new Review
        {
            Id = Guid.NewGuid(),
            ConsultationId = consultation.Id,
            SpecialistId = consultation.SpecialistId,
            ClientId = consultation.ClientId,
            Rating = dto.Rating,
            Text = dto.Text,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review submitted" });
    }

    [Authorize(Roles = "Specialist")]
    [HttpPatch("{id}/accept")]
    public async Task<IActionResult> AcceptRequest(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var request = await _context.ConsultationRequests
                .Include(r => r.Client)
                    .ThenInclude(c => c.Profile)
                        .FirstOrDefaultAsync(r => r.Id == id && r.SpecialistId.ToString() == userId);

        if (request == null) return NotFound("Request not found");

        var specialist = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id.ToString() == userId);
        if (specialist == null) return BadRequest("Specialist not found in Users");

        var consultation = new Consultation
        {
            SpecialistId = specialist.Id,
            Specialist = request.Specialist,
            ClientId = request.ClientId,
            Client = request.Client,
            StartTime = request.ScheduledAt,
            EndTime = request.ScheduledAt.AddMinutes(60),
            Topic = request.Topic ?? "",
            PricePaid = specialist.Profile.PricePerConsultation ?? 0,
            Status = "Scheduled",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        request.Status = "Accepted";
        request.StatusChangedAt = DateTime.UtcNow;

        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Consultation accepted" });
    }

    [Authorize(Roles = "Specialist")]
    [HttpPatch("{id}/reject")]
    public async Task<IActionResult> RejectRequest(Guid id, [FromBody] RejectDTO dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var request = await _context.ConsultationRequests.FindAsync(id);
        if (request == null || request.SpecialistId.ToString() != userId)
            return NotFound("Request not found or not yours");

        request.Status = "Rejected";
        request.RejectionReason = dto.Reason;
        request.StatusChangedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Request rejected" });
    }
}

