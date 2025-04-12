// 🛠 Backend должен поддерживать:
// Метод	URL	Описание
// GET	/api/calendar/my	Получить свои слоты
// POST	/api/calendar/add	Добавить слот { dateTime }
// DELETE	/api/calendar/remove/{slotId}	Удалить слот

import { useEffect, useState } from "react";

export default function CalendarManager() {
  const [slots, setSlots] = useState([]);
  const [dateTime, setDateTime] = useState("");

  const token = localStorage.getItem("token");

  const fetchSlots = async () => {
    const res = await fetch("https://localhost:5001/api/calendar/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSlots(data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async () => {
    if (!dateTime) return;
    await fetch("https://localhost:5001/api/calendar/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dateTime }),
    });
    setDateTime("");
    fetchSlots();
  };

  const handleDeleteSlot = async (id) => {
    await fetch(`https://localhost:5001/api/calendar/remove/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchSlots();
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Управление слотами</h2>

      <input
        type="datetime-local"
        className="p-2 w-full bg-zinc-700 text-white rounded mb-3"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />
      <button
        onClick={handleAddSlot}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 mb-4"
      >
        Добавить слот
      </button>

      <ul className="space-y-2">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="flex justify-between bg-zinc-700 px-4 py-2 rounded"
          >
            <span>{new Date(slot.dateTime).toLocaleString("ru-RU")}</span>
            <button
              onClick={() => handleDeleteSlot(slot.id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
