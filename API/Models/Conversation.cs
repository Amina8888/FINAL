namespace API.Models;
public class Conversation
{
    public Guid Id { get; set; }
    public string Participant1Id { get; set; }
    public string Participant1Name { get; set; }
    public string Participant2Id { get; set; }
    public string Participant2Name { get; set; }
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
