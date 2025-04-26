// GET	/api/chat/{consultationId}	Получить сообщения по консультации
// POST	/api/chat/{consultationId}	Отправить сообщение { message: string }

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    const res = await fetch(`https://localhost:5085/api/chat/${consultationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch(`https://localhost:5085/api/chat/${consultationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: text }),
    });

    setText("");
    fetchMessages();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto bg-zinc-800 p-4 rounded shadow h-[80vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4">Чат консультации</h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xs ${
              msg.isMine ? "bg-blue-600 ml-auto text-right" : "bg-zinc-700"
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs opacity-50 mt-1">{new Date(msg.sentAt).toLocaleTimeString()}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 p-2 rounded bg-zinc-700 text-white"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
