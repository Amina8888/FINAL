
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> ScheduleCall([FromBody] ScheduledCall call)
        {
            call.Id = Guid.NewGuid();
            call.UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            call.Status = "Scheduled";
            _context.ScheduledCalls.Add(call);
            await _context.SaveChangesAsync();
            return Ok(call);
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyCalls()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var calls = await _context.ScheduledCalls
                .Where(c => c.UserId == userId || c.SpecialistId == userId)
                .OrderBy(c => c.StartTime)
                .ToListAsync();

            return Ok(calls);
        }
    }
}
