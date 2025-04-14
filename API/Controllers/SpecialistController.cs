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
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class SpecialistController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConsultationService _consultationService;

    public SpecialistController(ApplicationDbContext context, IConsultationService consultationService)
    {
        _context = context;
        _consultationService = consultationService;
    }

    // Получение профиля
    [Authorize(Roles = "Specialist")]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await _context.SpecialistProfile
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null) return NotFound();
        return Ok(profile);
    }

    // Получение заявок
    [Authorize(Roles = "Specialist")]
    [HttpGet("requests")]
    public async Task<IActionResult> GetConsultationRequests()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var requests = await _consultationService.GetConsultationRequests(userId);
        return Ok(requests);
    }

    // Подтверждение консультации
    [Authorize(Roles = "Specialist")]
    [HttpPost("requests/{id}/confirm")]
    public async Task<IActionResult> ConfirmConsultation(Guid id)
    {
        var success = await _consultationService.ConfirmConsultation(id);
        if (!success) return NotFound();
        return Ok("Consultation confirmed.");
    }

    // Отклонение заявки
    [Authorize(Roles = "Specialist")]
    [HttpPost("requests/{id}/reject")]
    public async Task<IActionResult> RejectConsultation(Guid id)
    {
        var success = await _consultationService.RejectConsultation(id);
        if (!success) return NotFound();
        return Ok("Consultation rejected.");
    }

    // Получение истории консультаций
    [Authorize(Roles = "Specialist")]
    [HttpGet("consultations/history")]
    public async Task<IActionResult> ConsultationHistory()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var history = await _context.Consultations
            .Where(c => c.SpecialistId == userId && c.CreatedAt < DateTime.UtcNow)
            .ToListAsync();

        return Ok(history);
    }

    // Отправка заявки на вывод баланса
    [Authorize(Roles = "Specialist")]
    [HttpPost("withdraw")]
    public async Task<IActionResult> Withdraw([FromBody] WithdrawDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);

        if (user == null || string.IsNullOrEmpty(user.PayPalEmail))
            return BadRequest("PayPal email not set");

        // ... логика отправки заявки на вывод (или интеграция с PayPal Payouts)

        return Ok("Withdraw request submitted.");
    }

     // Синхронизация календаря
    [Authorize(Roles = "Specialist")]
    [HttpPost("sync-calendar")]
    public IActionResult SyncGoogleCalendar()
    {
        // Редирект на OAuth2 Google URL или запуск флоу синхронизации
        return Ok("Calendar sync initiated.");
    }

    // Обновление профиля
    [Authorize(Roles = "Specialist")]
    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateSpecialistProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var profile = await _context.SpecialistProfile
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (profile == null) return NotFound("Specialist profile not found.");

        profile.Resume = dto.Resume;
        profile.PricePerConsultation = dto.PricePerConsultation;
        profile.Subcategory = dto.Subcategory;

        await _context.SaveChangesAsync();
        return Ok("Profile updated.");
    }

    // Загрузка лицензии
    [Authorize(Roles = "Specialist")]
    [HttpPost("upload-license")]
    public async Task<IActionResult> UploadLicense([FromForm] UploadLicenseDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var profile = await _context.SpecialistProfile
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (profile == null) return NotFound("Specialist profile not found.");

        var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
        var path = Path.Combine("wwwroot", "licenses", fileName);

        using (var stream = new FileStream(path, FileMode.Create))
        {
            await dto.File.CopyToAsync(stream);
        }

        profile.LicenseDocumentUrl = $"/licenses/{fileName}";
        profile.IsLicenseApproved = false;

        await _context.SaveChangesAsync();
        return Ok("License uploaded and pending approval.");
    }

    // Установка PayPal email
    [Authorize(Roles = "Specialist")]
    [HttpPut("paypal")]
    public async Task<IActionResult> SetPayPalEmail([FromBody] string email)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return NotFound();

        user.PayPalEmail = email;
        await _context.SaveChangesAsync();

        return Ok("PayPal email updated.");
    }

    // Получение календаря
    [Authorize(Roles = "Specialist")]
    [HttpGet("calendar")]
    public async Task<IActionResult> GetCalendar()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var consultations = await _context.Consultations
            .Where(c => c.SpecialistId == userId)
            .ToListAsync();

        return Ok(consultations);
    }
}
