using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using System.IO;
using API.Data;


[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("approve-license/{specialistId}")]
    public async Task<IActionResult> ApproveLicense(Guid specialistId)
    {
        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.Id == specialistId);

        if (profile == null)
            return NotFound("Specialist not found.");

        profile.IsApproved = true;
        await _context.SaveChangesAsync();

        return Ok("License approved.");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reject/{id}")]
    public async Task<IActionResult> RejectSpecialist(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.Role != "Specialist")
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok("Specialist rejected and deleted.");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

}


