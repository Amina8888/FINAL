
using API.Models;
using API.DTOs;
using API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text.Json;

namespace API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(ApplicationDbContext context, IPasswordHasher<User> passwordHasher, IJwtTokenService jwtTokenService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
                return null;

            return _jwtTokenService.GenerateToken(user);
        }

        public async Task<object?> RegisterAsync(RegisterUserDto dto)
        {
            if (await UserExistsAsync(dto.Email))
                return null;

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Role = "User",
                PasswordHash = _passwordHasher.HashPassword(null, dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtTokenService.GenerateToken(user);
            return new { token, user };
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public string GetGoogleOAuthUrl()
        {
            var clientId = "YOUR_GOOGLE_CLIENT_ID";
            var redirectUri = "http://localhost:5000/api/account/google-callback";
            var scope = "openid%20email%20profile";
            var responseType = "code";
            var state = Guid.NewGuid().ToString();

            return $"https://accounts.google.com/o/oauth2/v2/auth?client_id={clientId}&redirect_uri={redirectUri}&response_type={responseType}&scope={scope}&state={state}";
        }

        public async Task<object?> HandleGoogleCallbackAsync(string code)
        {
            var clientId = "YOUR_GOOGLE_CLIENT_ID";
            var clientSecret = "YOUR_GOOGLE_CLIENT_SECRET";
            var redirectUri = "http://localhost:5000/api/account/google-callback";

            using var http = new HttpClient();

            var tokenResponse = await http.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", clientId },
                { "client_secret", clientSecret },
                { "redirect_uri", redirectUri },
                { "grant_type", "authorization_code" }
            }));

            if (!tokenResponse.IsSuccessStatusCode)
                return null;

            var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
            var tokenObj = JsonDocument.Parse(tokenJson).RootElement;
            var accessToken = tokenObj.GetProperty("access_token").GetString();

            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var userInfoResponse = await http.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");

            if (!userInfoResponse.IsSuccessStatusCode)
                return null;

            var userInfoJson = await userInfoResponse.Content.ReadAsStringAsync();
            var userInfo = JsonDocument.Parse(userInfoJson).RootElement;

            var email = userInfo.GetProperty("email").GetString();
            var name = userInfo.GetProperty("name").GetString();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    FullName = name,
                    Role = "User",
                    PasswordHash = _passwordHasher.HashPassword(null, Guid.NewGuid().ToString())
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var token = _jwtTokenService.GenerateToken(user);
            return new { token, user };
        }

        public async Task<UserDto?> GetCurrentUserInfoAsync(string userId)
        {
            var user = await _context.Users.FindAsync(Guid.Parse(userId));
            return user == null ? null : new UserDto { Id = user.Id, Email = user.Email, FullName = user.FullName };
        }

        public async Task<bool> RegisterUserAsync(RegisterUserDto dto)
        {
            // Можно объединить с RegisterAsync(dto)
            return await Task.FromResult(true);
        }

        public async Task<bool> RegisterSpecialistAsync(RegisterSpecialistDto dto)
        {
            // Заглушка — в будущем можно расширить
            return await Task.FromResult(true);
        }

        public async Task LogoutAsync()
        {
            // Здесь может быть очистка refresh-токенов, сессий и т.п.
            await Task.CompletedTask;
        }
    }
}
