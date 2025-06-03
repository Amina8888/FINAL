using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace API.Hubs
{
    public class VideoCallHub : Hub
    {
        private static readonly Dictionary<string, HashSet<string>> Rooms = new();

        public override async Task OnConnectedAsync()
        {
            var roomId = Context.GetHttpContext().Request.Query["roomId"];
            var connId = Context.ConnectionId;

            if (!Rooms.ContainsKey(roomId))
            {
                Rooms[roomId] = new HashSet<string>();
                Rooms[roomId].Add(connId);

                // Первый в комнате — он инициатор
                await Clients.Client(connId).SendAsync("StartAsCaller");
            }
            else
            {
                Rooms[roomId].Add(connId);
                // Остальные просто подключаются, никаких StartAsCaller
                await Clients.OthersInGroup(roomId).SendAsync("UserJoined");
            }

            await Groups.AddToGroupAsync(connId, roomId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var roomId = Context.GetHttpContext()?.Request.Query["roomId"];
            var connId = Context.ConnectionId;

            if (Rooms.ContainsKey(roomId))
            {
                Rooms[roomId].Remove(connId);

                if (Rooms[roomId].Count == 0)
                    Rooms.Remove(roomId);
            }

            await Groups.RemoveFromGroupAsync(connId, roomId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendOffer(string roomId, object offer)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveOffer", offer);
        }

        public async Task SendAnswer(string roomId, object answer)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveAnswer", answer);
        }

        public async Task SendIceCandidate(string roomId, object candidate)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveIceCandidate", candidate);
        }

        public async Task EndCall(string roomId)
        {
            await Clients.OthersInGroup(roomId).SendAsync("CallEnded");
        }
    }
}