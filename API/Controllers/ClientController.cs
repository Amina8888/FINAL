using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Linq;
using API.Data;
using API.Models;


[ApiController]
[Route("api/[controller]")]
public class ClientController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClientController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("specialists")]
    public async Task<IActionResult> GetSpecialists()
    {
        var specialists = await _context.Users
            .Where(u => u.Role == "Specialist" && u.IsApproved)
            .Select(u => new { u.Id, u.FullName, u.About, u.Email })
            .ToListAsync();

        return Ok(specialists);
    }

    [HttpGet("specialists/{id}")]
    public async Task<IActionResult> GetSpecialist(Guid id)
    {
        var specialist = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == "Specialist");

        if (specialist == null) return NotFound();

        return Ok(new { specialist.FullName, specialist.About, specialist.Email });
    }
}
