
using API.Models;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (result == null)
                return BadRequest("Registration failed");

            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var user = await _authService.GetCurrentUserInfoAsync(userId);
            return Ok(user);
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var url = _authService.GetGoogleOAuthUrl();
            return Redirect(url);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string state)
        {
            var result = await _authService.HandleGoogleCallbackAsync(code);
            if (result == null)
                return BadRequest("Google login failed");

            return Ok(result);
        }
    }
}
