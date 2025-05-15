using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Data;
using API.Models;

[Authorize(Roles = "Specialist")]
[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public LicenseController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetLicenses()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
        if (profile == null) return NotFound("Profile not found");

        var licenses = await _context.Licenses
            .Where(l => l.ProfileId == profile.Id)
            .Select(l => new {
                l.Id,
                l.FileUrl,
                l.Description,
                l.UploadedAt
            })
            .ToListAsync();

        return Ok(licenses);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLicense(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var license = await _context.Licenses
            .Include(l => l.Profile)
            .FirstOrDefaultAsync(l => l.Id == id && l.Profile.UserId.ToString() == userId);

        if (license == null) return NotFound("License not found");

        // Delete physical file if needed
        var filePath = Path.Combine(_env.WebRootPath, "uploads/licenses", Path.GetFileName(license.FileUrl));
        if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);

        _context.Licenses.Remove(license);
        await _context.SaveChangesAsync();
        return Ok(new { message = "License deleted" });
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadLicense([FromForm] IFormFile file, [FromForm] string? description)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
        if (profile == null) return NotFound("Profile not found");

        if (file == null || file.Length == 0) return BadRequest("File is empty");

        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads/licenses");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var license = new License
        {
            ProfileId = profile.Id,
            FileUrl = $"/uploads/licenses/{fileName}",
            Description = description
        };

        _context.Licenses.Add(license);
        await _context.SaveChangesAsync();

        return Ok(new { message = "License uploaded", license.FileUrl });
    }
}
