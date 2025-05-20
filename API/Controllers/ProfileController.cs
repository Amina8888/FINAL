using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Models;

[Authorize(Roles = "Specialist")]
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
        profile.Subcategory = dto.Subcategory ?? profile.Subcategory;
        profile.ProfileImageUrl = dto.ProfileImageUrl ?? profile.ProfileImageUrl;
        profile.PricePerConsultation = dto.PricePerConsultation ?? profile.PricePerConsultation;
        profile.Country = dto.Country ?? profile.Country;
        profile.City = dto.City ?? profile.City;

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

    [HttpPost("upload-avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var folderPath = Path.Combine("wwwroot", "avatars");
        Directory.CreateDirectory(folderPath);
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
        if (profile == null) return NotFound("Profile not found");

        profile.ProfileImageUrl = $"/avatars/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { url = profile.ProfileImageUrl });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var profile = await _context.Profiles
            .Include(p => p.Licenses)
            .Include(p => p.WorkExperiences)
            .FirstOrDefaultAsync(p => p.UserId.ToString() == userId);

        if (profile == null)
            return NotFound("Profile not found");

        return Ok(new
        {
            profile.FullName,
            profile.About,
            profile.ProfileImageUrl,
            profile.Category,
            profile.Subcategory,
            profile.Country,
            profile.City,
            profile.PricePerConsultation,
            certificateUrls = profile.Licenses.Select(l => l.FileUrl).ToList(),
            workExperiences = profile.WorkExperiences.Select(w => new
            {
                w.Id,
                w.Company,
                w.Position,
                w.Description,
                w.Duration
            })
        });
    }

}
