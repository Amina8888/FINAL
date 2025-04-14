using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using API.Models;
using API.DTOs;
using API.Data;
using System.Threading.Tasks;
using System.Linq;

namespace API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(ApplicationDbContext context, 
                           IPasswordHasher<User> passwordHasher, 
                           IJwtTokenService jwtTokenService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
                return null;

            return _jwtTokenService.GenerateToken(user);
        }

        public async Task<UserDto?> GetCurrentUserInfoAsync(string userId)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                FullName = user.FullName,
                About = user.About,
                PayPalEmail = user.PayPalEmail,
                IsApproved = user.IsApproved
            };
        }

        public async Task<bool> RegisterUserAsync(RegisterUserDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return false;

            var user = new User
            {
                Email = dto.Email,
                FullName = dto.FullName,
                Role = "User",
                PasswordHash = _passwordHasher.HashPassword(new User(), dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RegisterSpecialistAsync(RegisterSpecialistDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return false;

            var user = new User
            {
                Email = dto.Email,
                Role = "Specialist",
                PasswordHash = _passwordHasher.HashPassword(new User(), dto.Password)
            };

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
            _context.SpecialistProfile.Add(profile);
            await _context.SaveChangesAsync();

            return true;
        }

        public Task LogoutAsync()
        {
            // Логика выхода из системы (например, аннулирование refresh token)
            return Task.CompletedTask;
        }
    }
}