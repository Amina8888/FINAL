import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { useChatConnection } from "@/hooks/useChatConnections";

const MessageThread = () => {
  const { currentRecipient } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: string; content: string; timestamp: string }[]>([]);
  const { sendMessage, subscribe } = useChatConnection(localStorage.getItem("auth_token") || "");

  useEffect(() => {
    subscribe("ReceiveMessage", (msg) => {
      setMessages((prev) => [...prev, { from: msg.fromUserId, content: msg.message, timestamp: msg.timestamp }]);
    });
  }, [subscribe]);

  const handleSend = () => {
    if (!currentRecipient || !message.trim()) return;
    sendMessage(currentRecipient.id, message);
    setMessages((prev) => [...prev, { from: "me", content: message, timestamp: new Date().toISOString() }]);
    setMessage("");
  };

  if (!currentRecipient) {
    return <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a conversation</div>;
  }

  return (
    <div className="w-2/3 flex flex-col justify-between">
      <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
        <img src={currentRecipient.avatarUrl} alt={currentRecipient.name} className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium">{currentRecipient.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded-md w-fit max-w-[80%] ${msg.from === "me" ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${currentRecipient.name}...`}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
