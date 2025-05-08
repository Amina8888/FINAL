using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RefundController : ControllerBase
{
    [HttpPost("cancel")] // user cancels consultation
    public IActionResult CancelConsultation([FromBody] int consultationId)
    {
        // Stub: mark consultation cancelled
        return Ok("Cancelled");
    }

    [HttpPost("refund")]
    public IActionResult RefundPayment([FromBody] int paymentId)
    {
        // Stub: mark refund issued
        return Ok("Refund issued");
    }
}