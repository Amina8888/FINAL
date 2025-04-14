namespace API.DTOs;

public class AddReviewDto
{
    public int Rating { get; set; } // 1-5
    public string? FullText { get; set; }
}
