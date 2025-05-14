import { useState } from "react";
import { MessageSquare } from "lucide-react";
import ChatWindow from './ChatWindow';

const ChatLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      <button
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatLauncher;
