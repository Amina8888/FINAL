using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateProfile([FromBody] User updated)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return NotFound();

        user.FullName = updated.FullName;
        user.About = updated.About;
        await _context.SaveChangesAsync();

        return Ok("Profile updated.");
    }
}