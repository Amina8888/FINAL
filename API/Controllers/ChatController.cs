using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.DTOs;
using API.Services;
using API.Services.Implementations;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        // Получение сообщений чата для консультации
        [Authorize]
        [HttpGet("{consultationId}")]
        public async Task<IActionResult> GetChatMessages(Guid consultationId)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            try
            {
                var messages = await _chatService.GetMessagesAsync(consultationId);
                return Ok(messages);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // Отправка сообщения в чат для консультации
        [Authorize]
        [HttpPost("{consultationId}")]
        public async Task<IActionResult> SendMessage(Guid consultationId, [FromBody] ChatMessageDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            try
            {
                var message = await _chatService.SendMessageAsync(consultationId, dto, userId);
                return Ok(message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // ChatController.cs (fragment for file upload)
        [HttpPost("upload-file")]
        public IActionResult UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var filePath = Path.Combine("uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return Ok(new { path = filePath });
        }
    }
}

