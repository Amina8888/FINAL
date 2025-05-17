using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs
{
    public class UploadLicenseDto
    {
        [FromForm]
        public IFormFile File { get; set; } = null!;

        [FromForm]
        public string? Description { get; set; }
    }
}
