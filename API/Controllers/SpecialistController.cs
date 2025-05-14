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

    public SpecialistController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Specialist")]
    [HttpPatch("update-profile")]
    public async Task<IActionResult> UpdateSpecialistProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var profile = await _context.Profiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (profile == null) return NotFound("Specialist profile not found.");

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            profile.FullName = dto.FullName;

        if (!string.IsNullOrWhiteSpace(dto.About))
            profile.About = dto.About;

        if (!string.IsNullOrWhiteSpace(dto.Category))
            profile.Category = dto.Category;

        if (!string.IsNullOrWhiteSpace(dto.Subcategory))
            profile.Subcategory = dto.Subcategory;

        if (!string.IsNullOrWhiteSpace(dto.Resume))
            profile.Resume = dto.Resume;

        if (dto.PricePerConsultation.HasValue)
            profile.PricePerConsultation = dto.PricePerConsultation.Value;

        if (!string.IsNullOrWhiteSpace(dto.LicenseDocumentUrl))
            profile.LicenseDocumentUrl = dto.LicenseDocumentUrl;

        await _context.SaveChangesAsync();
        return Ok("Profile updated.");
    }

    [Authorize(Roles = "Specialist")]
    [HttpPost("upload-license")]
    public async Task<IActionResult> UploadLicense([FromForm] UploadLicenseDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (profile == null) return NotFound("Specialist profile not found.");

        var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
        var path = Path.Combine("wwwroot", "licenses", fileName);

        using (var stream = new FileStream(path, FileMode.Create))
        {
            await dto.File.CopyToAsync(stream);
        }

        profile.LicenseDocumentUrl = $"/licenses/{fileName}";
        profile.IsApproved = false;

        await _context.SaveChangesAsync();
        return Ok("License uploaded and pending approval.");
    }

    // [Authorize(Roles = "Specialist")]
    // [HttpPut("paypal")]
    // public async Task<IActionResult> SetPayPalEmail([FromBody] string email)
    // {
    //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    //     if (userId == null) return Unauthorized();

    //     var user = await _context.Users.FindAsync(Guid.Parse(userId));
    //     if (user == null) return NotFound();

    //     user.PayPalEmail = email;
    //     await _context.SaveChangesAsync();

    //     return Ok("PayPal email updated.");
    // }

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

    [Authorize(Roles = "Specialist")]
    [HttpPost("confirm/{id}")]
    public async Task<IActionResult> ConfirmConsultation(Guid id)
    {
        var consultation = await _context.Consultations.FindAsync(id);
        if (consultation == null) return NotFound();

        consultation.IsConfirmed = true;
        await _context.SaveChangesAsync();
        return Ok("Consultation confirmed.");
    }
}


