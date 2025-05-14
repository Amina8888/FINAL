import ConversationList from './ConversationList';
import MessageThread from './MessageThread';

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-[350px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ConversationList />
        <MessageThread />
      </div>
    </div>
  );
};

export default ChatWindow;
