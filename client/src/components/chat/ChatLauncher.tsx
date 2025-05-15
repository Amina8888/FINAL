import { useChat } from "@/contexts/ChatContext";
import { MessageSquare } from "lucide-react";
import ChatWindow from "./ChatWindow";

const ChatLauncher = () => {
  const { isChatOpen, openChat, closeChat, unreadTotal } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen && <ChatWindow onClose={closeChat} />}
      <button
        className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => (isChatOpen ? closeChat() : openChat())}
      >
        <MessageSquare className="w-6 h-6" />
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadTotal}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatLauncher;
