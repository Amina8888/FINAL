using Microsoft.AspNetCore.Http;

namespace API.DTOs;

public class UploadLicenseDto
{
    public IFormFile File { get; set; } = null!;
}
