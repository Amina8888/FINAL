using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] UpdateProfileDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
            return Unauthorized();

        var userId = Guid.Parse(userIdClaim);

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
            return NotFound("Profile not found.");

        profile.FullName = dto.FullName;
        profile.About = dto.About ?? profile.About;
        profile.Category = dto.Category ?? profile.Category;
        profile.Subcategory = dto.Subcategory;
        profile.Resume = dto.Resume ?? profile.Resume;
        profile.PricePerConsultation = dto.PricePerConsultation ?? profile.PricePerConsultation;
        profile.LicenseDocumentUrl = dto.LicenseDocumentUrl ?? profile.LicenseDocumentUrl;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully." });
    }

    [HttpPost("work-experience")]
    public async Task<IActionResult> AddWorkExperience([FromBody] WorkExperienceDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == Guid.Parse(userId));

        if (profile == null)
            return NotFound("Profile not found");

        var work = new WorkExperience
        {
            ProfileId = profile.Id,
            Company = dto.Company,
            Position = dto.Position,
            Description = dto.Description,
            Duration = dto.Duration
        };

        _context.WorkExperiences.Add(work);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Work experience added" });
    }

    [HttpPut("work-experience/{id}")]
    public async Task<IActionResult> UpdateWorkExperience(Guid id, [FromBody] WorkExperienceDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var work = await _context.WorkExperiences
            .Include(w => w.Profile)
            .FirstOrDefaultAsync(w => w.Id == id && w.Profile.UserId == Guid.Parse(userId));

        if (work == null)
            return NotFound("Experience not found");

        work.Company = dto.Company;
        work.Position = dto.Position;
        work.Description = dto.Description;
        work.Duration = dto.Duration;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Experience updated" });
    }

    [HttpDelete("work-experience/{id}")]
    public async Task<IActionResult> DeleteWorkExperience(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var work = await _context.WorkExperiences
            .Include(w => w.Profile)
            .FirstOrDefaultAsync(w => w.Id == id && w.Profile.UserId == Guid.Parse(userId));

        if (work == null)
            return NotFound("Experience not found");

        _context.WorkExperiences.Remove(work);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Experience removed" });
    }
}
