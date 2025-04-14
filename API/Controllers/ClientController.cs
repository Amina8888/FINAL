// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.EntityFrameworkCore;
// using System;
// using System.Threading.Tasks;
// using System.Security.Claims;
// using System.Linq;
// using API.Data;
// using API.Models;
// using API.DTOs;
// using API.Services;

// [ApiController]
// [Route("api/[controller]")]
// public class ClientController : ControllerBase
// {
//     private readonly ApplicationDbContext _context;
//     private readonly IConsultationService _consultationService;

//     public ClientController(ApplicationDbContext context, IConsultationService consultationService)
//     {
//         _context = context;
//         _consultationService = consultationService;
//     }

//     // Получение списка специалистов
//     [HttpGet("specialists")]
//     public async Task<IActionResult> GetSpecialists()
//     {
//         var specialists = await _context.SpecialistProfile
//             .Where(u => u.IsApproved)
//             .Select(u => new { u.Id,
//                 u.FullName,
//                 u.Category,
//                 u.Subcategory,
//                 u.AverageRating
//             })
//             .ToListAsync();

//         return Ok(specialists);
//     }

//     // Получение профиля специалиста
//     [HttpGet("specialists/{id}")]
//     public async Task<IActionResult> GetSpecialist(Guid id)
//     {
//         var specialist = await _context.SpecialistProfile
//             .FirstOrDefaultAsync(u => u.Id == id);

//         if (specialist == null) return NotFound();

//         return Ok(new { specialist.FullName, specialist.Resume, specialist.Email });
//     }

//     [Authorize(Roles = "User")]
//     [HttpPost("consultation/request")]
//     public async Task<IActionResult> RequestConsultation([FromBody] BookConsultationDto dto)
//     {
//         var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//         if (userId == null) return Unauthorized();

//         var success = await _consultationService.BookConsultation(Guid.Parse(userId), dto);
//         if (!success) return BadRequest("Slot unavailable.");

//         return Ok("Consultation requested.");
//     }

//     // Получение списка своих консультаций
//     [Authorize(Roles = "User")]
//     [HttpGet("consultations")]
//     public async Task<IActionResult> GetMyConsultations()
//     {
//         var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//         var consultations = await _context.Consultations
//             .Where(c => c.ClientId == userId)
//             .Include(c => c.Specialist)
//             .OrderByDescending(c => c.ScheduledAt)
//             .ToListAsync();

//         return Ok(consultations);
//     }

//         // Переназначение консультации
//     [Authorize(Roles = "User")]
//     [HttpPost("consultations/{id}/reschedule")]
//     public async Task<IActionResult> Reschedule(Guid id, [FromBody] RescheduleDto dto)
//     {
//         var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//         var success = await _consultationService.Reschedule(id, dto.consultationId, dto.newSlotId);

//         if (!success) return BadRequest("Unable to reschedule consultation.");

//         return Ok("Consultation rescheduled.");
//     }

//     // Подтверждение консультации
//     [Authorize(Roles = "Specialist")]
//     [HttpPost("consultations/{id}/confirm")]
//     public async Task<IActionResult> ConfirmConsultation(Guid id)
//     {
//         var success = await _consultationService.ConfirmConsultation(id);

//         if (!success) return NotFound("Consultation not found.");

//         return Ok("Consultation confirmed.");
//     }
// }

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
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        // Получение списка специалистов
        [HttpGet("specialists")]
        public async Task<IActionResult> GetSpecialists()
        {
            var specialists = await _clientService.GetSpecialistsAsync();
            return Ok(specialists);
        }

        // Получение профиля специалиста
        [HttpGet("specialists/{id}")]
        public async Task<IActionResult> GetSpecialist(Guid id)
        {
            var specialist = await _clientService.GetSpecialistByIdAsync(id);
            if (specialist == null) return NotFound();
            return Ok(specialist);
        }

        // Запрос на консультацию
        [Authorize(Roles = "User")]
        [HttpPost("consultation/request")]
        public async Task<IActionResult> RequestConsultation([FromBody] BookConsultationDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var success = await _clientService.RequestConsultationAsync(dto, Guid.Parse(userId));
            if (!success) return BadRequest("Slot unavailable.");

            return Ok("Consultation requested.");
        }

        // Получение списка консультаций клиента
        [Authorize(Roles = "User")]
        [HttpGet("consultations")]
        public async Task<IActionResult> GetMyConsultations()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var consultations = await _clientService.GetClientConsultationsAsync(userId);

            return Ok(consultations);
        }

        // Перенос консультации
        [Authorize(Roles = "User")]
        [HttpPost("consultations/{id}/reschedule")]
        public async Task<IActionResult> Reschedule(Guid id, [FromBody] RescheduleDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _clientService.RescheduleConsultationAsync(id, dto, userId);

            if (!success) return BadRequest("Unable to reschedule consultation.");

            return Ok("Consultation rescheduled.");
        }

        // Подтверждение консультации
        [Authorize(Roles = "Specialist")]
        [HttpPost("consultations/{id}/confirm")]
        public async Task<IActionResult> ConfirmConsultation(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _clientService.ConfirmConsultationAsync(id, userId);

            if (!success) return NotFound("Consultation not found.");

            return Ok("Consultation confirmed.");
        }
    }
}
