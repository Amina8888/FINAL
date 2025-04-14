// Назначение: Управление сообщениями внутри консультации
using API.Models;
using API.DTOs;

namespace API.Services
{
    public interface IChatService
    {
        Task<IEnumerable<ChatMessage>> GetMessagesAsync(Guid consultationId);
        Task<ChatMessage> SendMessageAsync(Guid consultationId, ChatMessageDto messageDto, Guid userId);
    }
}
