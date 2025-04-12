using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using System.IO;
using API.Models;
using API.DTOs;
using API.Services;
using API.Data;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AccountController(ApplicationDbContext context, IPasswordHasher<User> passwordHasher, IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register-specialist")]
    public async Task<IActionResult> RegisterSpecialist([FromBody] RegisterSpecialistDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email is already in use.");

        var user = new User
        {
            Email = dto.Email,
            Role = "Specialist"
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        var profile = new SpecialistProfile
        {
            User = user,
            FullName = dto.FullName,
            Category = dto.Category,
            Subcategory = dto.Subcategory,
            Resume = dto.Resume,
            PricePerConsultation = dto.PricePerConsultation
        };

        _context.Users.Add(user);
        _context.SpecialistProfiles.Add(profile);

        await _context.SaveChangesAsync();

        return Ok("Specialist registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return Unauthorized("Invalid credentials.");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid credentials.");

        var token = _jwtTokenService.GenerateToken(user);
        return Ok(new { token });
    }
}

