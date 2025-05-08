
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using API.Data;
using API.Models;

namespace API.Hubs
{

    public class VideoCallHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public VideoCallHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendSignal(string receiverConnectionId, string signalData)
        {
            await Clients.Client(receiverConnectionId).SendAsync("ReceiveSignal", Context.ConnectionId, signalData);
        }

        public override Task OnConnectedAsync()
        {
            // You can send back connection ID or notify others
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            // Handle user disconnection
            return base.OnDisconnectedAsync(exception);
        }


        public async Task SendMessage(string receiverConnectionId, string senderName, string message)
        {
            
            await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderName, message);

            var msg = new ChatMessage
            {
                SenderId = Guid.Parse(Context.UserIdentifier ?? Guid.Empty.ToString()),
                ReceiverId = Guid.TryParse(receiverConnectionId, out var rid) ? rid : Guid.NewGuid(),
                Message = message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(msg);
            await _context.SaveChangesAsync();
        
        }
    }
}
