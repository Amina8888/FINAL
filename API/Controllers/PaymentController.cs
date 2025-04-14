using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using System.IO;
using API.Data;
using API.Services;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;


[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPayPalService _payPalService;
    private readonly ApplicationDbContext _context;

    public PaymentController(IPayPalService payPalService, ApplicationDbContext context)
    {
        _payPalService = payPalService;
        _context = context;
    }

    [Authorize(Roles = "Client")]
    [HttpPost("create/{consultationId}")]
    public async Task<IActionResult> CreatePayment(Guid consultationId)
    {
        var consultation = await _context.Consultations
            .Include(c => c.CalendarSlot)
            .Include(c => c.Specialist)
            .FirstOrDefaultAsync(c => c.ConsultationId == consultationId);

        if (consultation == null) return NotFound("Consultation not found.");
        if (consultation.IsPaid) return BadRequest("Already paid.");

        // В реальной системе возьми цену из Specialist
        var amount = consultation.Specialist.PricePerConsultation;

        var checkoutUrl = await _payPalService.CreateCheckoutSessionAsync(consultationId, amount);
        return Ok(new { checkoutUrl });
    }

    [HttpGet("success")]
    public async Task<IActionResult> PaymentSuccess([FromQuery] string token, [FromQuery] Guid consultationId)
    {
        var result = await _payPalService.CapturePaymentAsync(token, consultationId);
        if (!result) return BadRequest("Payment capture failed");

        return Redirect("https://yourfrontend.com/payment/success");
    }
}
