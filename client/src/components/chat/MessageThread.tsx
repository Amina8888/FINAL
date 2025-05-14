import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatConnection } from "@/hooks/useChatConnections";

// Mock: assume this comes from consultation/payment state
const currentUserId = "user1";
const consultantId = "consultant123";
const accessToken = "mock-token"; // TODO: Replace with actual token logic

const MessageThread = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: string; content: string; timestamp: string }[]>([]);
  const { sendMessage, subscribe } = useChatConnection(accessToken);

  const canWrite = true; // TODO: derive from consultation/payment status

  useEffect(() => {
    subscribe("ReceiveMessage", (msg: { fromUserId: string; message: string; timestamp: string }) => {
      setMessages((prev) => [...prev, { from: msg.fromUserId, content: msg.message, timestamp: msg.timestamp }]);
    });
  }, [subscribe]);

  const handleSend = () => {
    if (!canWrite || !message.trim()) return;
    sendMessage(consultantId, message);
    setMessages((prev) => [...prev, { from: currentUserId, content: message, timestamp: new Date().toISOString() }]);
    setMessage("");
  };

  return (
    <div className="w-2/3 flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded-md w-fit max-w-[80%] ${msg.from === currentUserId ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        {!canWrite && (
          <div className="text-xs text-red-500 mb-2">
            You can message this consultant after payment.
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!canWrite}
            placeholder="Type your message..."
          />
          <Button onClick={handleSend} disabled={!canWrite}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
