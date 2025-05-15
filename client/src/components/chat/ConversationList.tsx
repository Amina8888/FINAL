import { useChat } from "@/contexts/ChatContext";
import { useEffect, useState } from "react";

const ConversationList = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const { setRecipient, markAsRead, setUnreadTotal } = useChat();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    // TODO: API call
    setConversations([
      {
        id: "4185caf8-ba7d-4381-8600-4f639c101408",
        name: "Jane Doe",
        avatarUrl: "https://i.pravatar.cc/40?img=1",
        lastMessage: "Hi there!",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
      },
    ]);
  }, []);

  const handleOpen = async (conv: any) => {
    setRecipient({
      id: conv.otherUserId,
      name: conv.name,
      avatarUrl: conv.avatarUrl,
      conversationId: conv.id,
    });
    await markAsRead(conv.id);
    setUnreadTotal((prev) => Math.max(prev - conv.unreadCount, 0));
  };

  const sorted = [...conversations].sort((a, b) =>
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );

  return (
    <div className={`${fullWidth ? "w-full" : "w-1/3"} overflow-y-auto`}>
      {sorted.map((c) => (
        <div
          key={c.id}
          onClick={() => handleOpen(c)}
          className="flex items-center gap-2 p-3 border-b hover:bg-gray-100 cursor-pointer"
        >
          <img src={c.avatarUrl} className="w-8 h-8 rounded-full" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(c.lastMessageTime).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">{c.lastMessage}</div>
          </div>
          {c.unreadCount > 0 && (
            <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {c.unreadCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
