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
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(ApplicationDbContext context, IPasswordHasher<User> passwordHasher, IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email is already in use.");

       if (string.IsNullOrWhiteSpace(dto.Role) || !(dto.Role == "User" || dto.Role == "Specialist"))
           return BadRequest("Invalid role.");

        var user = new User
        {
            Email = dto.Email,
            Role = dto.Role
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var profile = new Profile
        {
            UserId = user.Id,
            Role = user.Role,
            FullName = "",
            About = "",
            Category = "",
            ProfileImageUrl = "",
            PricePerConsultation = 0,
            IsApproved = user.Role == "User"
        };

        _context.Profiles.Add(profile);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registered successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Invalid credentials" });

        var token = _jwtTokenService.GenerateToken(user);
        return Ok(new { token, role = user.Role });
    }
}

