using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Data;
using API.Models;

[ApiController]
[Route("video")]
public class VideoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VideoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("{consultationId}")]
    public async Task<IActionResult> GetVideoRoom(Guid consultationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var consultation = await _context.Consultations.FindAsync(consultationId);
        if (consultation == null) return NotFound("Consultation not found.");

        if (consultation.ClientId != userId && consultation.SpecialistId != userId)
            return Forbid("You are not part of this consultation.");

        // Пример ссылки на Jitsi комнату
        var roomName = $"consultation-{consultationId}";
        var videoUrl = $"https://meet.jit.si/{roomName}";

        return Ok(new { url = videoUrl });
    }
}
