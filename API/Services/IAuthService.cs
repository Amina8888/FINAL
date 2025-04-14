// Назначение: Получение ID текущего пользователя из токена (удобно для сервисов).
using API.DTOs;
using API.Models;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string email, string password);
        Task<UserDto?> GetCurrentUserInfoAsync(string userId);
        Task<bool> RegisterUserAsync(RegisterUserDto userDto);
        Task<bool> RegisterSpecialistAsync(RegisterSpecialistDto specialistDto);
        Task LogoutAsync();
    }
}

