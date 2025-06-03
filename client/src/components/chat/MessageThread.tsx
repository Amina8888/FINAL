import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { useChatConnection } from "@/hooks/useChatConnections";

interface Message {
  from: string;
  content: string;
  timestamp: string;
}

const MessageThread = () => {
  const { currentRecipient } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage, subscribe } = useChatConnection(localStorage.getItem("auth_token") || "");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentRecipient) return;

    // Fetch chat history from backend
    fetch(`/api/chat/conversations/${currentRecipient.conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then(async (res) => {
      if (res.status === 404) {
        // Нет сообщений — это не ошибка
        return [];
      }
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    })
    .then(setMessages)
    .catch((err) => {
      console.warn("Fetch messages error", err);
      setMessages([]); // Покажем пустой список
    });
}, [currentRecipient]);

  useEffect(() => {
    subscribe("ReceiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [subscribe]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!currentRecipient || !message.trim()) return;

    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({
        conversationId: currentRecipient.conversationId,
        toUserId: currentRecipient.id,
        content: message,
      }),
    });

    if (res.ok) {
      setMessages((prev) => [
        ...prev,
        {
          from: "me",
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    }
  };

  if (!currentRecipient) {
    return <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a conversation</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
        <img src={currentRecipient.avatarUrl} alt={currentRecipient.name} className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium">{currentRecipient.name}</span>
      </div>
  
      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-400 text-center mt-4">No messages yet</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded-md w-fit max-w-[80%] ${
                msg.from === "me" ? "bg-blue-100 ml-auto" : "bg-gray-100"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        {/* Для скролла вниз */}
        <div ref={scrollRef}></div>
      </div>
  
      {/* Input at bottom */}
      <div className="p-3 border-t flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${currentRecipient.name}...`}
          rows={1}
          className="flex-1 resize-none rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[120px] overflow-y-auto"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default MessageThread;
