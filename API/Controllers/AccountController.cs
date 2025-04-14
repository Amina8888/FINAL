using API.Models;
using API.DTOs;
using API.Services;
using API.Data;

using System.Security.Claims;
using System.Linq; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.Email, dto.Password);
            if (token == null)
                return Unauthorized("Invalid credentials.");

            return Ok(new { token });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _authService.GetCurrentUserInfoAsync(userId);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost("register-specialist")]
        public async Task<IActionResult> RegisterSpecialist([FromBody] RegisterSpecialistDto dto)
        {
            var result = await _authService.RegisterSpecialistAsync(dto);
            if (result)
                return Ok("Specialist registered successfully.");

            return BadRequest("Email is already in use.");
        }

        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            var result = await _authService.RegisterUserAsync(dto);
            if (result)
                return Ok("User registered successfully.");

            return BadRequest("Email is already in use.");
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            _authService.LogoutAsync();
            return Ok("Logged out successfully.");
        }
    }
}
