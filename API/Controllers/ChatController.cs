using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using API.Data;
using API.Hubs;
using API.Models;
using API.Services;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<ChatHub> _hub;

    public ChatController(ApplicationDbContext context, IHubContext<ChatHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet("conversations")]
    [Authorize]
    public async Task<IActionResult> GetConversations()
    {
        var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

        var conversations = await _context.Conversations
            .Include(c => c.Messages)
            .Where(c => c.Participant1Id == userId || c.Participant2Id == userId)
            .Select(c => new
            {
                c.Id,
                Name = c.Participant1Id == userId ? c.Participant2Name : c.Participant1Name,
                AvatarUrl = _context.Profiles
                    .Where(p => p.UserId.ToString() == (c.Participant1Id == userId ? c.Participant2Id : c.Participant1Id))
                    .Select(p => p.ProfileImageUrl)
                    .FirstOrDefault() ?? 
                    "https://i.pravatar.cc/40?u=" + (c.Participant1Id == userId ? c.Participant2Id : c.Participant1Id),
                LastMessage = c.Messages.OrderByDescending(m => m.Timestamp).FirstOrDefault().Content,
                LastMessageTime = c.Messages.OrderByDescending(m => m.Timestamp).FirstOrDefault().Timestamp,
                UnreadCount = c.Messages.Count(m => !m.IsRead && m.ToUserId == userId)
            })
            .ToListAsync();

        return Ok(conversations);
    }

    [HttpPatch("conversations/{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

        var messages = await _context.Messages
            .Where(m => m.ConversationId == id && m.ToUserId == userId && !m.IsRead)
            .ToListAsync();

        foreach (var message in messages)
            message.IsRead = true;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("messages")] 
    [Authorize]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.ToUserId) || string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest("Missing fields");
        var fromUserId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = dto.ConversationId,
            FromUserId = fromUserId,
            ToUserId = dto.ToUserId,
            Content = dto.Content,
            Timestamp = DateTime.UtcNow,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        await _hub.Clients.User(dto.ToUserId).SendAsync("ReceiveMessage", new
        {
            fromUserId,
            message = dto.Content,
            timestamp = message.Timestamp
        });

        return Ok();
    }
}
