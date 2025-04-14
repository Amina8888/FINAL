using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services.Implementations
{
    public class ChatService : IChatService
    {
        private readonly ApplicationDbContext _context;

        public ChatService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получение сообщений для консультации
        public async Task<IEnumerable<ChatMessage>> GetMessagesAsync(Guid consultationId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.ConsultationId == consultationId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return messages;
        }

        // Отправка сообщения
        public async Task<ChatMessage> SendMessageAsync(Guid consultationId, ChatMessageDto messageDto, Guid userId)
        {
            var consultation = await _context.Consultations
                .FirstOrDefaultAsync(c => c.ConsultationId == consultationId);

            if (consultation == null || (consultation.ClientId != userId && consultation.SpecialistId != userId))
                throw new UnauthorizedAccessException("User is not authorized to send a message for this consultation.");

            var message = new ChatMessage
            {
                ConsultationId = consultationId,
                SenderId = userId,
                Message = messageDto.Message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return message;
        }
    }
}
