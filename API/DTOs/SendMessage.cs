namespace API.DTOs
{
    public class SendMessageDto
    {
        public Guid ConversationId { get; set; }
        public string ToUserId { get; set; } = null!;
        public string Content { get; set; } = null!;
    }
}
