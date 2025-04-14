namespace API.Models;

public class ChatMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ConsultationId { get; set; }
    public Consultation Consultation { get; set; } = null!;
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;
    public string Message { get; set; } = null!;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

// public enum MessageType
// {
//     Text,
//     Image,
//     File
// }

// public MessageType Type { get; set; } = MessageType.Text;
