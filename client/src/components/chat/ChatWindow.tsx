import { ChevronLeft, X } from "lucide-react";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import { useChat } from "@/contexts/ChatContext";

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const { currentRecipient, clearRecipient } = useChat();

  return (
    <div className="w-[350px] h-[500px] bg-white rounded-t-lg shadow-xl flex flex-col">
      <div className="bg-[#007aff] text-white p-3 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          {currentRecipient && (
            <button onClick={clearRecipient} className="text-white">
              <ChevronLeft size={24} />
            </button>
          )}
          <h2 className="text-lg font-semibold">
            {currentRecipient ? currentRecipient.name : "Messages"}
          </h2>
        </div>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {currentRecipient ? <MessageThread /> : <ConversationList fullWidth />}
      </div>
    </div>
  );
};

export default ChatWindow;
