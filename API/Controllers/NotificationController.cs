using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private static List<Notification> _notifications = new List<Notification>();

    [HttpGet("user")]
    public IActionResult GetUserNotifications()
    {
        var userId = User.Identity.Name; // replace with proper user id retrieval
        var result = _notifications.Where(n => n.UserId == userId).ToList();
        return Ok(result);
    }

    [HttpPost("mark-as-read")]
    public IActionResult MarkAsRead([FromBody] int notificationId)
    {
        var notif = _notifications.FirstOrDefault(n => n.Id == notificationId);
        if (notif != null)
        {
            notif.IsRead = true;
            return Ok();
        }
        return NotFound();
    }
}

public class Notification
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string Text { get; set; }
    public string Type { get; set; }
    public bool IsRead { get; set; }
}
