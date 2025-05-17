import React, { createContext, useContext, useEffect, useState } from "react";

interface Recipient {
  id: string;
  name: string;
  avatarUrl?: string;
  conversationId: string; 
}

interface ChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;

  currentRecipient: Recipient | null;
  setRecipient: (r: Recipient) => void;
  clearRecipient: () => void;

  unreadTotal: number;
  setUnreadTotal: React.Dispatch<React.SetStateAction<number>>;
  readChats: string[];
  markAsRead: (id: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [readChats, setReadChats] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("read_chats");
    if (stored) setReadChats(JSON.parse(stored));
    const total = localStorage.getItem("unread_total");
    if (total) setUnreadTotal(parseInt(total));
  }, []);

  const markAsRead = async (id: string) => {
    if (!readChats.includes(id)) {
      const updated = [...readChats, id];
      setReadChats(updated);
      localStorage.setItem("read_chats", JSON.stringify(updated));
    }

    try {
      await fetch(`http://localhost:5085/api/chat/conversations/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.warn("Failed to patch conversation read status", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        openChat: () => setIsChatOpen(true),
        closeChat: () => setIsChatOpen(false),
        currentRecipient,
        setRecipient: setCurrentRecipient,
        clearRecipient: () => setCurrentRecipient(null),
        unreadTotal,
        setUnreadTotal,
        readChats,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
} 
