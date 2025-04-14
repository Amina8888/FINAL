using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.DTOs;
using API.Services;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _calendarService;

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        // Создание слота специалиста
        [Authorize(Roles = "Specialist")]
        [HttpPost("create-slot")]
        public async Task<IActionResult> CreateSlot([FromBody] CreateCalendarSlotDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _calendarService.CreateCalendarSlotAsync(dto, userId);

            if (result == "Profile not found.")
                return BadRequest(result);

            return Ok(result);
        }

        // Получение своих слотов
        [Authorize(Roles = "Specialist")]
        [HttpGet("my-slots")]
        public async Task<IActionResult> GetMySlots()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var slots = await _calendarService.GetMySlotsAsync(userId);

            if (slots == null || !slots.Any())
                return NotFound("No slots found.");

            return Ok(slots);
        }

        // Получение доступных слотов
        [AllowAnonymous]
        [HttpGet("specialist/{id}/available")]
        public async Task<IActionResult> GetAvailableSlots(Guid id)
        {
            var slots = await _calendarService.GetAvailableSlotsAsync(id);

            if (slots == null || !slots.Any())
                return NotFound("No available slots found.");

            return Ok(slots);
        }

        // Удаление слота
        [Authorize(Roles = "Specialist")]
        [HttpDelete("remove/{slotId}")]
        public async Task<IActionResult> RemoveSlot(Guid slotId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _calendarService.RemoveSlotAsync(slotId, userId);

            if (result == "Profile not found." || result == "Slot not found.")
                return BadRequest(result);

            return Ok(result);
        }
    }
}
